import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";

export abstract class PuppeteerStarter {
    public browser: Browser;
    public page: Page;

    constructor(
        public url: string
    ) {}

    public usePlugins() {
        puppeteer.use(StealthPlugin());
        puppeteer.use(
            RecaptchaPlugin({
                provider: {
                  id: '2captcha',
                  token: '833f14594793c869f4a57f2b6d408cc6' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
                },
                visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
              })
        );
    }

    public async start() {
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