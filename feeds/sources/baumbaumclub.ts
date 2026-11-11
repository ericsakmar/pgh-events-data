import Parser from "rss-parser";
import { type Feed, filterInvalid } from "../feed.ts";

const parser = new Parser({
  customFields: {
    item: [["media:thumbnail", "thumbnail"]],
  },
});

export const name = "Baum Baum Club";

export const getLinks = async (): Promise<Feed[]> => {
  const feed = await parser.parseURL(
    "https://us21.campaign-archive.com/feed?u=846131e441a6e3dd98300670d&id=2fef46a36e",
  );

  const links = feed.items.map((i) => ({
    title: i.title,
    subtitle: name,
    url: i.link,
    timestamp: i.isoDate,
    tags: ["blog"],
    image: "https://brand-assets.mailchimp.com/01KZ4J2BT78273YG3QE2G776WQ.png",
  }));

  return filterInvalid(links);
};
