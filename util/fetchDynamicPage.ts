import * as puppeteer from "puppeteer";

const TIMEOUT = 10_000;

const getPage = async (url: string, selector: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.emulateTimezone("America/New_York");

  const res = await page.goto(url);

  await page.waitForSelector(selector, { timeout: TIMEOUT });
  const content = await page.content();

  // should this be in a finally() or something?
  await browser.close();

  return content;
};

export const fetchDynamicPage = async (
  url: string,
  waitForSelector: string,
) => {
  const content = getPage(url, waitForSelector);
  return content;
};
