import fs from 'fs';
import path from 'path';
import { replaceTemplate } from '../utils/replaceTemplate';

const downloadImage = async (url: string, imagePath: string): Promise<void> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download image: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(imagePath, Buffer.from(buffer));
};

export const scrapeContent = async (browser: any, link: { title: string; link: string }, updateProgress: () => void): Promise<any> => {
    const page = await browser.newPage();
    await page.goto(link.link, { waitUntil: 'networkidle2' });

    const content = await page.evaluate(() => {
        const body: any = document.querySelector(".single-body");
        return body ? body.textContent.trim().split("\n")[0] : '';
    });

    const imageSrc = await page.$eval(".single-body img", (img: HTMLImageElement) => img.src);
    const imagePath = path.join(__dirname, "../images", `${Date.now()}.jpg`);
    await downloadImage(imageSrc, imagePath);
    const linkList = await page.$eval(".quote", async (quote: { childNodes: any; }) => {
        const links: string[] = [];
        const linkNodes: any = quote.childNodes;
        for (const linkNode of linkNodes) {
            if (linkNode.nodeType === Node.TEXT_NODE) {
                const text: string = linkNode.textContent.trim();
                if (text !== "") {
                    const splitLinks = text.split("\n");
                    for (const splitLink of splitLinks) {
                        links.push(splitLink.trim());
                    }
                }
            } else if (linkNode.nodeType === Node.ELEMENT_NODE && linkNode.tagName === "A") {
                links.push(linkNode.href);
            }
        }
        return links;
    });
    const postHtmlTemplate = fs.readFileSync(path.join(__dirname, '../templates/postTemplate.fdciabdul'), { encoding: 'utf-8' });

    const replacements = {
        title: link.title,
        details: content,
        imagePath,
        links: linkList,
    };
    const postHtml = replaceTemplate(postHtmlTemplate, replacements);

    await page.close();

    updateProgress(); 

    return {
        html: postHtml,
        imagePath,
    };
};
