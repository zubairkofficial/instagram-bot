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
        this.usePlugins();
        this.browser = await puppeteer.launch({
            defaultViewport: null,
            headless: false,
            args: [
                "--no-sandbox",
                "--disable-blink-features=AutomationControlled",
                '--disable-features=IsolateOrigins,site-per-process,SitePerProcess',
                '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
            ]
        });
        this.page = await this.browser.newPage();
        await this.page.goto(this.url, {
            waitUntil: 'networkidle0',
        });
        await this.afterStart();
    }

    protected abstract afterStart(): unknown;
}