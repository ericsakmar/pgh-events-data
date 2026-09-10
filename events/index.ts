import * as smalls from "./sources/smalls.ts";

export const getEvents = async () => {
  const events = await smalls.getEvents();
  return events;
};
