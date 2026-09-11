import * as amw from "./sources/amw.ts";
import * as arcade from "./sources/arcade.ts";
import * as smalls from "./sources/smalls.ts";
import { type Event } from "./event.ts";

const POST_NODE_TYPE = `Event`;
const MAX_RETRIES = 3;

const getWithRetry = async (
  url: string,
  getEvents: () => Promise<Event[]>,
  retries = 0,
): Promise<Event[]> => {
  try {
    const events = await getEvents();

    if (events.length === 0) {
      console.warn(`no events found for ${url}`);
    }

    return events;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.warn(`retrying ${url} (${retries + 1}/${MAX_RETRIES})`);
      const retry = await getWithRetry(url, getEvents, retries + 1);
      return retry;
    } else {
      console.warn(`max retries exceeded for ${url}`);
      console.warn(error);

      return [];
    }
  }
};

export const getEvents = async () => {
  // TODO filter things that hav already happened

  const allSources = [arcade, smalls, amw];

  const devSources = [arcade];

  const sources =
    process.env.NODE_ENV === "development" ? devSources : allSources;

  const events = (
    await Promise.all(
      sources.map((source) => getWithRetry(source.url, source.getEvents)),
    )
  ).flat();

  return events;
};
