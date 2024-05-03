import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { scrapeLinks } from "./src/services/scrapeLinks";
import { scrapeContent } from "./src/services/scrapeContents";
import color from 'cli-color';
import { createPost, getCategories } from "./src/lib/wordpressAPI";
import { selectCategory } from "./src/utils/selectCategory";
import process from "process";
import cliProgress from "cli-progress";
import { config } from "./config";
process.removeAllListeners('warning');
puppeteer.use(StealthPlugin());

function formatter(options: { barsize: number; barCompleteString: string; barIncompleteString: string; }, params: { progress: number; value: number; total: number; }, payload: { task: any; }) {
    const barSize = options.barsize || 20;
    const barCompleteString:any = options.barCompleteString || "█".repeat(barSize);
    const barIncompleteString:any = options.barIncompleteString || "░".repeat(barSize);

    const progressBarComplete = barCompleteString.substr(0, Math.round(params.progress * barSize));
    const progressBarIncomplete = barIncompleteString.substr(progressBarComplete.length);

    const bar = progressBarComplete + progressBarIncomplete;
    const valueText = `${params.value}/${params.total}`;

    if (params.value >= params.total) {
        return `# ${color.green(payload.task)}   ${color.green(valueText)} --[${bar}]--`;
    } else {
        return `# ${payload.task}   ${color.yellow(valueText)} --[${bar}]--`;
    }
}

const progressBarOptions:any = {
    format: formatter,
    barsize: 30, 
};

const progressBar = new cliProgress.SingleBar(progressBarOptions, cliProgress.Presets.shades_classic);

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const categories = await getCategories();
    const categoryId = await selectCategory(categories);

    progressBar.start(config.howManyPages, 0, { task: "Collecting Pages" });

    const linksList = await scrapeLinks(browser, updateProgress);

    progressBar.stop();

    progressBar.start(linksList.length, 0, { task: "Scraping" });

    for (let i = 0; i < linksList.length; i++) {
        const link = linksList[i];
        console.log(`Processing post: ${link.title}`);
        const Post = await scrapeContent(browser, link, updateProgress);
        await createPost(link.title, Post.html, Post.imagePath, categoryId);
    }

    progressBar.stop();
    await browser.close();
})();

function updateProgress() {
    progressBar.increment(); // Increment the progress bar by 1
}
