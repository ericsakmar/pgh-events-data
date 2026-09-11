import * as amw from "./sources/amw.ts";
import * as arcade from "./sources/arcade.ts";
import * as smalls from "./sources/smalls.ts";
import * as baumBaumClub from "./sources/baumbaumclub.ts";
import * as belvederes from "./sources/belvederes.ts";
import * as bottlerocket from "./sources/bottlerocket.ts";
import * as carnegieHomestead from "./sources/carnegieHomestead.ts";
import * as cityOfAsylum from "./sources/cityOfAsylum.ts";
import * as clubCafe from "./sources/clubCafe.ts";
import * as conAlma from "./sources/conAlma.ts";
import * as crafthouse from "./sources/crafthouse.ts";
import * as glitterbox from "./sources/glitterbox.ts";
import * as goldmark from "./sources/goldmark.ts";
import * as governmentCenter from "./sources/governmentCenter.ts";
import * as greenBeacon from "./sources/greenBeacon.ts";
import * as jergels from "./sources/jergels.ts";
import * as mattressFactory from "./sources/mattressFactory.ts";
import * as mixtape from "./sources/mixtape.ts";
import * as moondogs from "./sources/moondogs.ts";
import * as newHazlettTheater from "./sources/newHazlettTheater.ts";
import * as oaks from "./sources/oaks.ts";
import * as oneTwoThree from "./sources/oneTwoThree.ts";
import * as ormsby from "./sources/ormsby.ts";
import * as parkhouse from "./sources/parkhouse.ts";
import * as perryHouse from "./sources/perryHouse.ts";
import * as poetry from "./sources/poetry.ts";
import * as dltsgdom from "./sources/dltsgdom.ts";
import * as preserving from "./sources/preserving.ts";
import * as remedy from "./sources/remedy.ts";
import * as roxian from "./sources/roxian.ts";
import * as shredshed from "./sources/shredshed.ts";

import { type Event } from "./event.ts";

const MAX_RETRIES = 3;

// I'm not thrilled with this retry. Consider rewriting and adding exponential backoff
// something here might not be exiting correctly
const getWithRetry = async (
  url: string,
  getEvents: () => Promise<Event[]>,
  retries = 0,
): Promise<Event[]> => {
  try {
    const events = await getEvents();

    if (events.length === 0) {
      console.warn(`no events found for ${url}`);
    }

    return events;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.warn(`retrying ${url} (${retries + 1}/${MAX_RETRIES})`);
      const retry = await getWithRetry(url, getEvents, retries + 1);
      return retry;
    } else {
      console.warn(`max retries exceeded for ${url}`);
      console.warn(error);

      return [];
    }
  }
};

export const getEvents = async () => {
  // TODO filter things that hav already happened
  // TODO don't forget about Brillo if the site ever comes back online
  // TODO also don't forget to bring back user submitted events

  const allSources = [
    amw,
    arcade,
    baumBaumClub,
    belvederes,
    bottlerocket,
    carnegieHomestead,
    cityOfAsylum,
    clubCafe,
    conAlma,
    crafthouse,
    dltsgdom,
    glitterbox,
    goldmark,
    governmentCenter,
    greenBeacon,
    jergels,
    mattressFactory,
    mixtape,
    moondogs,
    newHazlettTheater, // TODO not working
    oaks,
    oneTwoThree,
    ormsby,
    parkhouse,
    perryHouse,
    poetry,
    preserving,
    remedy,
    roxian,
    shredshed,
    smalls,
  ];

  const devSources = [dltsgdom, preserving, roxian, remedy, shredshed];

  const sources =
    process.env.NODE_ENV === "development" ? devSources : allSources;

  const events = (
    await Promise.all(
      sources.map((source) => getWithRetry(source.url, source.getEvents)),
    )
  ).flat();

  return events;
};
