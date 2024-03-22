import { setTimeout } from 'timers/promises';
import { Page } from "puppeteer";
import { Executor } from './executor';

export class TargetAccount extends Executor {
    constructor(
        protected page: Page,
        public targetUsername: string,
    ) {
        super();
    }

    protected get url() {
        return `https://www.instagram.com/${this.targetUsername}/followers`;
    }

    protected async goToPage() {
        let currentUrl = this.page.url();
        if (currentUrl.endsWith('/')) currentUrl = currentUrl.substring(0, currentUrl.length - 1);
        if (this.url === currentUrl) return;

        await this.page.goto(this.url, {
            waitUntil: 'networkidle0',
        });
    }

    public async startFollowing(maxFollowers: number) {
        await this.goToPage();
        await setTimeout(3000);
        return await this.follow(maxFollowers);
    }

    public async getList() {
        await this.goToPage();
        return await this.list();
    }

    public async unfollowUser(usernameToUnfollow: string) {
        await this.goToPage();
        return await this.unfollow(usernameToUnfollow);
    }
}