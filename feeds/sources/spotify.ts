import { parseISO, isAfter, parse } from "date-fns";
import { type Feed, filterInvalid } from "../feed.ts";

// TODO some day consider removing all of these `any`s

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

type ShowInfo = {
  id: string;
  name: string;
};

const SHOW_IDS: ShowInfo[] = [
  // these haven't updated for quite some time
  // { id: "4JZQQui0EI2SS1glrSYXuE", name: "Dog With A Mullet" },
  // { id: "4Z37CsR7DEIv1fPQjocgzd", name: "Yinz World" },
  // { id: "0r8E0rY07DP3USUsHsOxcs", name: "Qool Hand Podcast" },
];

const PLAYLIST_IDS = [
  "3bHROgTxhHazGaKYSdXTV7", // pittsburgh indie
  "1s3veNWm04XXIKjSblDZov", // bottle rocket coming attrtactions
  "7v17EhPkbct20cz98FAa3O", // bottle rocket staff picks
  "6Iw5wOtMbK8yNS0OspzbI6", // another bottle rocket coming attractions
  "2FdCATcA4vY34267lIRsLY", // up next at gov center
  "0FFYMRnIs3bveFloqw6G2R", // dltsgdom upcoming
  "5jSmjHBRxmBU4F6kS3nn2R", // dltsgdom now playing
  "39wtmUHDbA9XbZePrSJg1t", // steel city violence
  "0cCxsYg3qd7W3FHDrJlspC", // crafted sounds
];

const getToken = async () => {
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const tokenData = await tokenRes.json();
  const { access_token } = tokenData;
  return access_token;
};

const getPlaylists = async (token: string) => {
  const detailRequests = PLAYLIST_IDS.map(
    (id) => `https://api.spotify.com/v1/playlists/${id}`,
  ).map((p) =>
    fetch(p, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );

  const detailRes = await Promise.all(detailRequests);
  const details = await Promise.all(detailRes.map((d) => d.json()));

  return details;
};

const getLastUpdated = (tracks: any) => {
  const lastAdded = tracks
    .map((track: any) => ({ ...track, added_at: parseISO(track.added_at) }))
    .reduce((last: any, track: any) =>
      isAfter(track.added_at, last.added_at) ? track : last,
    );

  return lastAdded.added_at;
};

const getShows = async (token: string) => {
  const detailRequests = SHOW_IDS.map(
    (show) => `https://api.spotify.com/v1/shows/${show.id}/episodes`,
  ).map((p) =>
    fetch(p, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );

  const detailRes = await Promise.all(detailRequests);
  const details = await Promise.all(detailRes.map((d) => d.json()));

  return details;
};

export const name = "spotify";

export const getLinks = async (): Promise<Feed[]> => {
  const token = await getToken();
  const playlists = await getPlaylists(token);
  const shows = await getShows(token);

  const links = playlists.map((p) => ({
    title: p.name,
    subtitle: "Spotify",
    url: p.external_urls.spotify,
    timestamp: getLastUpdated(p.tracks.items).toISOString(),
    tags: ["playlist"],
    image: p.images[0].url,
  }));

  const show_links = shows.flatMap((show, i) =>
    show.items.map((episode: any) => ({
      title: episode.name,
      subtitle: SHOW_IDS[i].name,
      url: episode.external_urls.spotify,
      timestamp: parse(
        episode.release_date,
        "yyyy-MM-dd",
        new Date(),
      ).toISOString(),
      tags: ["podcast"],
      image: episode.images[0].url,
    })),
  );

  const all = [...links, ...show_links];
  return filterInvalid(all);
};
