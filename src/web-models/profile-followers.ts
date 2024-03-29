import { Page } from "puppeteer";
import { Executor } from "./executor";

export class ProfileFollowers extends Executor {
    constructor(
        protected page: Page,
        protected username: string,
    ) {
        super();
    }

    public async goToPage() {
        let url = `https://www.instagram.com/${this.username}/followers`;
        // if (which === "following") url = `https://www.instagram.com/${this.username}/following`;

        let currentUrl = this.page.url();
        if (currentUrl.endsWith('/')) currentUrl = currentUrl.substring(0, currentUrl.length - 1);
        if (url === currentUrl) return;

        await this.page.goto(url, {
            waitUntil: 'networkidle0',
        });
    }

    public async get() {
        await this.goToPage();
        return await this.list();
    }

    public async click(username: string) {
        await this.goToPage();
        return await this.clickButton(username);
    }
}