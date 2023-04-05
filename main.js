const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const shortenUrl = require("./lib/safelink");
const createPost = require("./lib/wp");
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");
const clc = require("cli-color");
const config = require("./config");
puppeteer.use(StealthPlugin());

(async () => {
        const browser = await puppeteer.launch({
                headless: false
        });
        const link = [];
        for (let t = 1; t < config.howManyPages; t++) {
                const page = await browser.newPage();
                await page.goto(`https://codelist.cc/php-script/pgs/${t}`, {
                        waitUntil: "networkidle2",
                });
                color(
                        `Collect links in : https://codelist.cc/php-script/pgs/${t}`,
                        "yellow"
                );
                // Get the titles and links of all posts on the page
                const posts = await page.$$eval(
                        "#dle-content > div > article > div.post__text > h3 > a",
                        (postNodes) =>
                        postNodes.map((postNode) => ({
                                title: postNode.innerText,
                                link: postNode.href,
                        }))
                );
                link.push(...posts);
                await page.close();
        }

        color("All done , Total links :  " + link.length, "green");
        color("Start Scraping...", "green");

        for (let i = 0; i < link.length; i++) {
                const pages = await browser.newPage();
                await pages.goto(link[i].link, {
                        waitUntil: "networkidle2"
                });

                // Wait for the content to load
                await pages.waitForSelector(".single-body");
                color("Scraping Data from : " + link[i].title, "yellow");
                // Save the image locally
                const imageResponse = await fetch(imageSrc);
                const imageBuffer = await imageResponse.buffer();
                const imagePath = path.join(__dirname, "images", `image${i}.jpg`);
                fs.writeFileSync(imagePath, imageBuffer);

                // Get the post details
                const postDetails = await pages.$eval(".single-body", (body) => {
                        console.log(body);
                        // get text
                        const text = body.textContent.trim().split("\n")[0];
                        return text;
                });

                // Get the link list
                const linkList = await pages.$eval(".quote", async (quote) => {
                        const links = [];
                        const linkNodes = quote.childNodes;
                        for (const linkNode of linkNodes) {
                                if (linkNode.nodeType === Node.TEXT_NODE) {
                                        const text = linkNode.textContent
                                .trim();
                                        if (text !== "") {
                                                const splitLinks = text.split(
                                                        "\n");
                                                for (const splitLink of
                                                                splitLinks) {
                                                        links.push(splitLink
                                                                .trim());
                                                }
                                        }
                                }
                                else if (
                                        linkNode.nodeType === Node
                                        .ELEMENT_NODE &&
                                        linkNode.tagName === "A"
                                ) {
                                        links.push(linkNode.href);
                                }
                        }
                        return links;
                });

                // Shorten the links
                const shortenedLinks = await Promise.all(
                        linkList.map((link) => shortenUrl(link))
                );

                // Create post content HTML
                const contentHtml = `
    <h1>${link[i].title}</h1>
    <p>${postDetails}</p>
    <ul>
    <p dir="auto">[quick_download_button title="Download" open_new_window="true" url_external="${
      shortenedLinks[0]
    }"]</p>
    <p dir="auto"><strong>Alternative Links : </strong></p>
      ${shortenedLinks
        .map((link) => `<li><a href="${link}">${link}</a></li>`)
        .join("")}
    </ul>
  `;
                //console.log(contentHtml);
                await createPost(link[i].title, contentHtml, imagePath);
                await pages.close();
        }

        await browser.close();
})();

function color(str, color) {
        return console.log(clc[color](str));
}
