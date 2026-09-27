import { getEvents } from "./events/index.ts";
import { getFeeds } from "./feeds/index.ts";

import fs from "node:fs/promises";

const args = process.argv.slice(2);

const runAll = args.includes("--all");
const runEvents = args.includes("--events") || runAll;
const runFeeds = args.includes("--feeds") || runAll;

const save = (fileName: string, data: any) =>
  fs.writeFile(fileName, JSON.stringify(data, null, 2));

const main = async () => {
  await Promise.all([
    runEvents
      ? getEvents().then((events) => save("events.json", events))
      : Promise.resolve(),

    runFeeds
      ? getFeeds().then((feeds) => save("feeds.json", feeds))
      : Promise.resolve(),
  ]);
};

await main();
