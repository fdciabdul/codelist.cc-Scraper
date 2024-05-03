import { config } from "../../config";

export async function scrapeLinks(browser: any): Promise<{ title: string; link: string }[]> {
  const linksList: { title: string; link: string }[] = [];
  for (let t = 1; t <= config.howManyPages; t++) {
    const page = await browser.newPage();
    await page.goto(`https://codelist.cc/scripts3/pges/${t}`, {
      waitUntil: "networkidle2",
    });
    const posts = await page.$$eval("#dle-content > div > article > div.post__text > h3 > a", (postNodes: Element[]) =>
      postNodes.map((postNode) => ({
        title: (postNode as HTMLAnchorElement).innerText,
        link: (postNode as HTMLAnchorElement).href,
      }))
    );
    linksList.push(...posts);
    await page.close();
  }
  return linksList;
}