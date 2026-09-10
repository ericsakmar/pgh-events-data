import { parseDate as parseDateBase } from "chrono-node";

// TODO figure out some way to handle EST/EDT
// if you're fixing this, remember to fix it in csv.js too
export const parseDate = (rawDate: string) =>
  parseDateBase(rawDate, { timezone: /* "EST"*/ "EDT" })?.toISOString();
