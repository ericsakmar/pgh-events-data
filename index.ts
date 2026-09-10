import { getEvents } from "./events/index.ts";

const main = async () => {
  const events = await getEvents();
  console.log(events);
};

await main();
