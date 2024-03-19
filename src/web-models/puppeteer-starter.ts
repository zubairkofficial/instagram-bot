import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

export abstract class PuppeteerStarter {
    public browser: Browser;
    public page: Page;

    constructor(
        public url: string
    ) {}

    public async start() {
        puppeteer.use(stealthPlugin());
        this.browser = await puppeteer.launch({
            defaultViewport: null,
            headless: true,
            args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"]
        });
        this.page = await this.browser.newPage();
        await this.page.goto(this.url, {
            waitUntil: 'networkidle0',
        });
        await this.afterStart();
    }

    protected abstract afterStart(): unknown;
}