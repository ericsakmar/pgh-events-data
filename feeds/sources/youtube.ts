import Parser from "rss-parser";
import { type Feed, filterInvalid } from "../feed.ts";

const parser = new Parser({
  customFields: {
    item: [["media:group", "media"]],
  },
});

const CHANNEL_IDS = [
  "UC1WvWt8qjthHWTj9sYX65Xw", // michi tapes
  "UCQwUJhguRTEAZrhj2GjKlRQ", // bottle rocket
  "UCXGve1fVe8kOan1prjkyafg", // i quit my band
  "UCj05itdKFi1F93TbZrHlpRA", // modest director
  "UCy7GWS2r7d-dPhWNSC5ri9A", // vibe vote
  "UC1j_mioKL69rn_8P821iehA", // little giant
  "UCGd9HYAFcmULiyoSsNEZLWw", // thunderbird
  "UCfsmz7-5_Gw2UlPmCn1LMjQ", // enjoy wrestling
  "UCqf3IkFdeTJg2F17jpNMuYQ", // no skip show
  "UC9WLEFXZmaohzgFsjUqWtHg", // plankfan
  "UCfyxMrvJnoGAZFqJI4b3AgQ", // wyep
  "UCkarZl_u7MeMwrHUCejHSkw", // baum baum club
  "UC-8Wg-glwdQ0Z4bVrYJegZQ", // wpts
];

const getChannel = async (id: string) => {
  const feed = await parser.parseURL(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`,
  );

  const links = feed.items.map((i) => ({
    title: i.title,
    subtitle: feed.title,
    url: i.link,
    timestamp: i.isoDate,
    tags: ["youtube channel"],
    image: i.media["media:thumbnail"][0]["$"].url,
  }));

  return links;
};

export const getLinks = async (): Promise<Feed[]> => {
  const links = await Promise.all(CHANNEL_IDS.map(getChannel));
  return filterInvalid(links.flatMap((l) => l));
};

export const name = "youtube";
