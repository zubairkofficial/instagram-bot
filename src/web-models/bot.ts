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
        const loginInput = await this.page.waitForSelector("[name='username']");
        const passwordInput = await this.page.waitForSelector("[name='password']");
        const loginButton = await this.page.waitForSelector("form [type='submit']");

        await loginInput.type(this.data.username);
        await passwordInput.type(this.data.password);

        await this.page.screenshot({ path: 'screenshot.jpg' });
        await loginButton.click();
        try {
            await this.page.waitForNavigation({
                waitUntil: 'networkidle0',
            });
        } catch {}
    }

    public async close() {
        await this.browser.close();
    }

}