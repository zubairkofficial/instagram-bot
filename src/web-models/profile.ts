import { Page } from "puppeteer";
import { Executor } from "./executor";

export class Profile extends Executor {
    constructor(
        protected page: Page,
        protected username: string,
    ) {
        super();
    }

    public async goToPage(which: "followers" | "following") {
        let url = "";
        if (which === "followers") url = `https://www.instagram.com/${this.username}/followers`;
        if (which === "following") url = `https://www.instagram.com/${this.username}/following`;

        let currentUrl = this.page.url();
        if (currentUrl.endsWith('/')) currentUrl = currentUrl.substring(0, currentUrl.length - 1);
        if (url === currentUrl) return;

        await this.page.goto(url, {
            waitUntil: 'networkidle0',
        });
    }

    public async getFollowers() {
        await this.goToPage("followers");
        return await this.list();
    }

    public async getFollowing() {
        await this.goToPage("following");
        return await this.list();
    }
}