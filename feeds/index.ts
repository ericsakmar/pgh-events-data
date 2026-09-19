import * as agaveparty from "./sources/agaveparty.ts";
import { getWithRetry } from "../util/getWithRetry.ts";

export const getFeeds = async () => {
  const allSources = [agaveparty];

  const devSources = [agaveparty];

  const sources =
    process.env.NODE_ENV === "development" ? devSources : allSources;

  const events = (
    await Promise.all(
      sources.map((source) => getWithRetry(source.name, source.getLinks)),
    )
  ).flat();

  return events;
};
