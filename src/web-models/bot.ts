import { setTimeout } from 'timers/promises';
import { writeFile } from 'fs/promises';
import { InstagramData } from "./instagram-data";
import { PuppeteerStarter } from "./puppeteer-starter";
import { Follower } from './follower';

export class Bot extends PuppeteerStarter {

    url: string;
    follower: Follower;

    constructor(
        public data: InstagramData
    ) {
        const url = "https://www.instagram.com";
        super(url);
        this.url = url;
    }

    protected async afterStart() {
        this.follower = new Follower(this.page, this.data.targetUsername);
    }

    public async login() {
        const cookiesButton = await this.page.$("._a9--._ap36._a9_0");
        const loginInput = await this.page.waitForSelector("[name='username']");
        const passwordInput = await this.page.waitForSelector("[name='password']");
        const loginButton = await this.page.waitForSelector("form [type='submit']");

        if (cookiesButton) {
            await cookiesButton.click();
            await setTimeout(2000);
        }

        await loginInput.type(this.data.username);
        await passwordInput.type(this.data.password);

        await loginButton.click();
        try {
            await this.page.waitForNavigation({
                waitUntil: 'networkidle0',
            });
        } catch {
            console.log("Error in waiting for navigation after login. See screenshot.");
            await this.page.screenshot({ path: 'screenshot.jpg' });
            writeFile(
                'body.html',
                await this.page.evaluate(() => document.body.innerHTML)
            );
        }
    }

    public async close() {
        await this.browser.close();
    }

}