import { setTimeout } from 'timers/promises';
import { writeFile } from 'fs/promises';
import { InstagramData } from "./instagram-data";
import { PuppeteerStarter } from "./puppeteer-starter";
import { TargetAccount } from './target-account';
import { ProfileFollowers } from './profile-followers';
import { ProfileFollowing } from './profile-following';

export class Bot extends PuppeteerStarter {

    url: string;
    targetAccount: TargetAccount;
    profileFollowers: ProfileFollowers;
    profileFollowing: ProfileFollowing;

    constructor(
        protected data: InstagramData
    ) {
        const url = "https://www.instagram.com";
        super(url);
        this.url = url;
    }

    public get targetUsername() {
        return this.data.targetUsername;
    }

    public set targetUsername(newUsername: string) {
        this.targetAccount.targetUsername = this.data.targetUsername = newUsername;
    }

    protected async afterStart() {
        const targetAccountPage = await this.browser.newPage();
        this.targetAccount = new TargetAccount(targetAccountPage, this.data.targetUsername);

        const profilePage1 = await this.browser.newPage();
        this.profileFollowers = new ProfileFollowers(profilePage1, this.data.username);

        const profilePage2 = await this.browser.newPage();
        this.profileFollowing = new ProfileFollowing(profilePage2, this.data.username);
    }

    public async login() {
        try {
            const cookiesButton = await this.page.waitForSelector("._a9--._ap36._a9_0", {
                timeout: 5000
            });
            await cookiesButton.click();
            await setTimeout(1000);
        } catch { }

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
        } catch { }

        for (const frame of this.page.mainFrame().childFrames()) {
            await frame.solveRecaptchas()
        }

        try {
            const nextButton = await this.page.waitForSelector("[role='button']");
            await nextButton.click();
            await this.page.waitForNavigation({
                waitUntil: 'networkidle0',
            });
        } catch { }

        await setTimeout(500);
    }

    public async screenshot() {
        return await this.page.screenshot({ fullPage: true });
    }

    public async html() {
        return await this.page.content();
    }

    public async close() {
        await this.browser.close();
    }

}