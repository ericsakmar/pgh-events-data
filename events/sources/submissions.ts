import { type Event, filterInvalid } from "../event.ts";
import { Pool, type PoolClient } from "pg";
import { addHours } from "date-fns";

const pool = new Pool({
  connectionString: process.env.ADMIN_DATABASE_URL,
  // Optional: timeouts
  // connectionTimeoutMillis: 5000,
  // idleTimeoutMillis: 10000,
});

export const url = "submissions";

// this is the thing you're supposed to remember to change
const utc_offset = 4; // 5

async function queryDatabase() {
  let client: PoolClient | undefined = undefined;

  try {
    client = await pool.connect();

    const eventsRes = await client.query(
      `SELECT name, date, location, "eventLink", "posterLink" FROM "Event" WHERE approved=TRUE`,
    );

    const events = eventsRes.rows.map((r) => ({
      title: r.name,
      date: addHours(r.date, utc_offset).toISOString(),
      location: r.location,
      link: r.eventLink,
      poster: r.posterLink ?? undefined,
      source: "https://pgh.events",
      hasTime: true,
      city: "pgh",
    }));

    return events;
  } catch (err) {
    console.error("Error connecting or querying database:", err);
    return [];
  } finally {
    if (client) {
      client.release();
    }
  }
}

export const getEvents = async (): Promise<Event[]> => {
  const dbEvents = await queryDatabase();
  return filterInvalid(dbEvents);
};
