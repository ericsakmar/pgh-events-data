import Parser from "rss-parser";
import { type Feed, filterInvalid } from "../feed.ts";

const parser = new Parser();

export const name = "cruel noise";

export const getLinks = async (): Promise<Feed[]> => {
  const feed = await parser.parseURL("http://feeds.libsyn.com/82511/rss");

  const links = feed.items.map((i) => ({
    title: i.title,
    subtitle: "Cruel Noise",
    url: i.link,
    timestamp: i.isoDate,
    tags: ["podcast"],
    image:
      "https://ssl-static.libsyn.com/p/assets/c/5/b/0/c5b017eeb31e690e/cruel_podcast_new.jpg",
  }));

  return filterInvalid(links);
};
