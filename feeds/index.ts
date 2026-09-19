import * as agaveparty from "./sources/agaveparty.ts";
import * as boom from "./sources/boom.ts";
import * as boredinpittsburgh from "./sources/boredinpittsburgh.ts";
import * as buildthescene from "./sources/buildthescene.ts";
import * as callback from "./sources/callback.ts";
import * as cruelnoise from "./sources/cruelnoise.ts";
import * as noskip from "./sources/noskip.ts";
import * as pghmanifold from "./sources/pghmanifold.ts";
import * as spotify from "./sources/spotify.ts";
import * as startthebeat from "./sources/startthebeat.ts";
import * as telegraphtree from "./sources/telegraphtree.ts";

import { getWithRetry } from "../util/getWithRetry.ts";
import { isAfter, subMonths } from "date-fns";

// TODO consider making a helper for libsyn?

export const getFeeds = async () => {
  const allSources = [
    agaveparty,
    boom,
    boredinpittsburgh,
    buildthescene,
    callback,
    cruelnoise,
    noskip,
    pghmanifold,
    spotify,
    startthebeat,
    telegraphtree,
  ];

  const devSources = [
    noskip,
    pghmanifold,
    spotify,
    startthebeat,
    telegraphtree,
  ];

  const sources =
    process.env.NODE_ENV === "development" ? devSources : allSources;

  const now = new Date();
  const maxAge = subMonths(now, 6);

  const feeds = (
    await Promise.all(
      sources.map((source) => getWithRetry(source.name, source.getLinks)),
    )
  )
    .flat()
    .filter((f) => isAfter(f.timestamp, maxAge));

  return feeds;
};
