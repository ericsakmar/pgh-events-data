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

import { type Event } from "./event.ts";

const MAX_RETRIES = 3;

// I'm not thrilled with this retry. Consider rewriting and adding exponential backoff
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
    smalls,
  ];

  const devSources = [
    carnegieHomestead,
    cityOfAsylum,
    clubCafe,
    conAlma,
    crafthouse,
  ];

  const sources =
    process.env.NODE_ENV === "development" ? devSources : allSources;

  const events = (
    await Promise.all(
      sources.map((source) => getWithRetry(source.url, source.getEvents)),
    )
  ).flat();

  return events;
};
