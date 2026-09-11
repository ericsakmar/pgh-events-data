import * as smalls from "./sources/smalls.ts";
import * as amw from "./sources/amw.ts";
import * as arcade from "./sources/arcade.ts";

export const getEvents = async () => {
  // TODO retries and stuff
  // TODO filter things that hav already happened

  const allSources = [smalls.getEvents, amw.getEvents];
  const devSources = [arcade.getEvents];

  const sources =
    process.env.NODE_ENV === "development" ? devSources : allSources;

  const events = (await Promise.all(sources.map((source) => source()))).flat();

  return events;
};
