import { getEvents } from "./events/index.ts";
import fs from "node:fs/promises";

const main = async () => {
  const events = await getEvents();
  await fs.writeFile("events.json", JSON.stringify(events, null, 2));
};

await main();
