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
        try {
            const cookiesButton = await this.page.waitForSelector("._a9--._ap36._a9_0");
            await cookiesButton.click();
            await setTimeout(2000);
        } catch {}

        const loginInput = await this.page.waitForSelector("[name='username']");
        const passwordInput = await this.page.waitForSelector("[name='password']");
        const loginButton = await this.page.waitForSelector("form [type='submit']");

        await loginInput.type(this.data.username);
        await passwordInput.type(this.data.password);

        await loginButton.click();

        try {
            await this.page.waitForNavigation({
                waitUntil: 'networkidle0',
            });
        } catch {}

        const recaptchaCheckbox = 
            await this
                .page
                .frames()
                .find(frame => frame.url().toString().startsWith("https://www.google.com/recaptcha"))
                ?.$(".recaptcha-checkbox");
            await recaptchaCheckbox?.click();
            console.log(this.page.frames().map(frame => frame.url().toString()));

        await setTimeout(1500);
        await this.page.screenshot({ path: 'screenshot.jpg' });
    }

    public async close() {
        await this.browser.close();
    }

}