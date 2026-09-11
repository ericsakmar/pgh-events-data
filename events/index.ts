import * as smalls from "./sources/smalls.ts";
import * as amw from "./sources/amw.ts";

export const getEvents = async () => {
  // TODO retries and stuff
  // TODO filter things that hav already happened
  const events = Promise.all([smalls.getEvents(), amw.getEvents()]).then(
    (results) => results.flat(),
  );

  return events;
};
