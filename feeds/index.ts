import * as agaveparty from "./sources/agaveparty.ts";
import * as boom from "./sources/boom.ts";
import * as boredinpittsburgh from "./sources/boredinpittsburgh.ts";
import * as buildthescene from "./sources/buildthescene.ts";
import * as callback from "./sources/callback.ts";
import * as cruelnoise from "./sources/cruelnoise.ts";

import { getWithRetry } from "../util/getWithRetry.ts";

export const getFeeds = async () => {
  const allSources = [
    agaveparty,
    boom,
    boredinpittsburgh,
    buildthescene,
    callback,
    cruelnoise,
  ];

  const devSources = [
    boom,
    boredinpittsburgh,
    buildthescene,
    callback,
    cruelnoise,
  ];

  const sources =
    process.env.NODE_ENV === "development" ? devSources : allSources;

  const events = (
    await Promise.all(
      sources.map((source) => getWithRetry(source.name, source.getLinks)),
    )
  ).flat();

  // TODO filter old?

  return events;
};
