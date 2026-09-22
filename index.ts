import { getEvents } from "./events/index.ts";
import { getFeeds } from "./feeds/index.ts";

import fs from "node:fs/promises";

const main = async () => {
  await Promise.all([
    getEvents().then((events) =>
      fs.writeFile("events.json", JSON.stringify(events, null, 2)),
    ),

    getFeeds().then((feeds) =>
      fs.writeFile("feeds.json", JSON.stringify(feeds, null, 2)),
    ),
  ]);
};

await main();
