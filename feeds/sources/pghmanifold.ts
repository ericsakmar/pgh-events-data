import * as cheerio from "cheerio";
import { fetchPage } from "../../util/fetchPage.ts";
import { parseDate } from "../../util/parseDate.ts";
import { type Feed, filterInvalid } from "../feed.ts";

export const name = "pgh manifold";

export const getLinks = async (): Promise<Feed[]> => {
  const data = await fetchPage(
    "https://www.pittsburghmanifold.com/post-category/music",
  );
  const $ = cheerio.load(data);

  const links = $(".w-dyn-item")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find("h2").text().trim();
      const postInfo = n.find(".post-info-box").text().trim();
      const [_, rawDate] = postInfo.split("•");
      const date = parseDate(rawDate);
      const link = n.find("a").first().attr("href")?.trim();
      const image = n.find(".image-cover").attr("src")?.trim();

      return {
        title,
        subtitle: "Pittsburgh Manifold",
        url: `https://www.pittsburghmanifold.com${link}`,
        timestamp: date,
        tags: ["blog"],
        image,
      };
    });

  return filterInvalid(links);
};
