import { fetchPage } from "../../util/fetchPage.ts";
import { type Feed, filterInvalid } from "../feed.ts";

export const name = "agave party";

export const getLinks = async (): Promise<Feed[]> => {
  const raw = await fetchPage(
    "https://api.mixcloud.com/agaveparty/cloudcasts/",
  );

  const feed = JSON.parse(raw);

  const links = feed.data.map((i: any) => ({
    title: i.name,
    subtitle: "Agave Party",
    url: i.url,
    timestamp: i.created_time,
    tags: ["podcast"],
    image: i.pictures.large,
  }));

  return filterInvalid(links);
};
