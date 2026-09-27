import nodeIcal from "node-ical";

import { type Event, filterInvalid } from "../event.ts";

export const url =
  "https://calendar.google.com/calendar/ical/315c83af04e2750a795a7463729bcd697de4ff043f539791e0397a4ef05a127c%40group.calendar.google.com/public/basic.ics";

export const getEvents = async (): Promise<Event[]> => {
  const cal = await nodeIcal.async.fromURL(url);
  const icalEvents = Object.values(cal).filter((e) => e?.type === "VEVENT");

  const events = icalEvents.map((icalEvent) => {
    const title = icalEvent.summary ? icalEvent.summary.toString() : undefined;
    const date = icalEvent.start?.toISOString();
    const location = "Bantha Tea Bar";
    const link = "https://www.banthateabar.com/calendar";
    const poster =
      "https://images.squarespace-cdn.com/content/v1/589b4a379de4bbae87c5b4c1/1487971492528-YUT3YEI7JD7686IWPL13/Bantha-logo_FINAL_web.png?format=500w";

    return {
      title,
      date,
      location,
      link,
      source: url,
      hasTime: true,
      poster,
      city: "pgh",
    };
  });

  return filterInvalid(events);
};
