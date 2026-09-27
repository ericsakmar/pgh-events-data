import nodeIcal from "node-ical";

import { type Event, filterInvalid } from "../event.ts";

export const url =
  "https://calendar.google.com/calendar/ical/c_8504edaf8e8eb89489e7149a27c5753189f7311346461219318cecb74090e686%40group.calendar.google.com/public/basic.ics";

export const getEvents = async (): Promise<Event[]> => {
  const cal = await nodeIcal.async.fromURL(url);
  const icalEvents = Object.values(cal).filter((e) => e?.type === "VEVENT");

  const events = icalEvents.map((icalEvent) => {
    const title = icalEvent.summary ? icalEvent.summary.toString() : undefined;
    const date = icalEvent.start?.toISOString();
    const location = "Velum Fermentation";
    const link = "https://www.velumfermentation.com/events/";
    const poster =
      "https://images.getbento.com/accounts/0302abcc397d473ee45d815949e66462/media/images/39248logo1.png";

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
