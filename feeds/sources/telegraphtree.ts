import { fetchPage } from "../../util/fetchPage.ts";
import { type Feed, filterInvalid } from "../feed.ts";

export const name = "telegraph tree";

export const getLinks = async (): Promise<Feed[]> => {
  const raw = await fetchPage(
    "https://telegraphtree.com/wp-json/wp/v2/posts?_embed",
  );

  const feed = JSON.parse(raw);

  const links = feed.map((i: any) => ({
    title: i.title.rendered,
    subtitle: "Telegraph Tree",
    url: i.link,
    timestamp: new Date(i.date).toISOString(),
    tags: ["blog"],
    image: i._embedded["wp:featuredmedia"]?.[0]?.source_url,
  }));

  return filterInvalid(links);
};
