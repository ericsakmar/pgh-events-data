import Parser from "rss-parser";
import { type Feed, filterInvalid } from "../feed.ts";

const parser = new Parser();

export const name = "start the beat";

export const getLinks = async (): Promise<Feed[]> => {
  const feed = await parser.parseURL("http://feeds.libsyn.com/70343/rss");

  const links = feed.items.map((i) => ({
    title: i.title,
    subtitle: "Start The Beat",
    url: i.link,
    timestamp: i.isoDate,
    tags: ["podcast"],
    image: i.itunes.image,
  }));

  return filterInvalid(links);
};
