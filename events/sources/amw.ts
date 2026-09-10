import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchDynamicPage } from "../../util/fetchDynamicPage.ts";

export const url = "https://acousticmusicworks.com/collections/concert-tickets";

const waitForSelector = `.product-loop`;

export const getEvents = async () => {
  const data = await fetchDynamicPage(url, waitForSelector);

  const $ = cheerio.load(data);

  const events = $(".product-index")
    .toArray()
    .map((el) => {
      const n = $(el);

      // In-Store Concert, April 22nd - Evan McMillian, Adelaide Estep & Connor Bragg, Skye Burkett - 1 TICKET
      const details = n.find(".product-details").text().trim();

      const [rawDate, title] = details.split(" - ");

      const date = parseDate(rawDate);

      const location = "Acoustic Music Works";

      const link = n.find(".product-details a").attr("href")?.trim();

      const poster = n.find(".hidden img").attr("src")?.trim();

      return {
        title,
        date,
        location,
        link: `https://acousticmusicworks.com${link}`,
        source: url,
        poster,
        city: "pgh",
      };
    });

  return events;
};
