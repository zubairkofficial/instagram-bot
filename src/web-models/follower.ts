import { setTimeout } from 'timers/promises';
import { Page, ElementHandle } from "puppeteer";

interface IFollowingUser {
    username: string,
    buttonText: string
}

export class Follower {
    protected url: string;

    constructor(
        protected page: Page,
        protected targetUsername: string,
    ) {
        this.url = `https://www.instagram.com/${this.targetUsername}/followers`
    }

    public async goToPage() {
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

        const buttonsSelector = ".x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3 button";

        let followedCount = 0, nowFollowed = 0;
        const followedAccounts: string[] = [];

        outerLoop: while (true) {
            const followButtons = (await this.page.$$(buttonsSelector)).slice(followedCount);
            if (followButtons.length === 0) break;

            for (const button of followButtons) {
                if (nowFollowed >= maxFollowers) break outerLoop;

                await button.scrollIntoView();
                const buttonText = await button.evaluate(el => el.textContent);

                if (buttonText.trim() === "Follow") {
                    await button.click();
                    await setTimeout(1000);
                    nowFollowed++;

                    const followedAccount = await button.evaluate(
                        btn =>
                            btn
                                .closest(".x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3")
                                .querySelector("._ap3a._aaco._aacw._aacx._aad7._aade")
                                .textContent
                    );
                    followedAccounts.push(followedAccount);
                }

                followedCount++;
            }

            await setTimeout(5000);
        }

        return { nowFollowed, followedAccounts };
    }

    public async getList() {
        await this.goToPage();

        const followerSelector = ".x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3";
        let followerDivs: ElementHandle<Element>[] = [];
        const list: IFollowingUser[] = [];

        do {
            await setTimeout(5000);
            followerDivs = (await this.page.$$(followerSelector)).splice(list.length);

            for (const followerDiv of followerDivs) {
                followerDiv.scrollIntoView();

                const followerInfo = await followerDiv.evaluate(
                    elm => ({
                        'username': elm.querySelector("._ap3a._aaco._aacw._aacx._aad7._aade").textContent,
                        'buttonText': elm.querySelector('button').textContent.trim()
                    })
                );

                list.push(followerInfo);
            }
        } while (followerDivs.length > 0);

        return list;
    }

    public async unfollow(usernameToUnfollow: string) {
        await this.goToPage();

        const followerSelector = ".x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3";
        let followerDivs: ElementHandle<Element>[] = [];
        let matchedUsers = 0;

        do {
            await setTimeout(5000);
            followerDivs = (await this.page.$$(followerSelector)).splice(matchedUsers);

            for (const followerDiv of followerDivs) {
                followerDiv.scrollIntoView();

                const username = await followerDiv.evaluate(
                    elm => elm.querySelector("._ap3a._aaco._aacw._aacx._aad7._aade").textContent
                );

                if (usernameToUnfollow === username) {
                    (await followerDiv.$("button")).click();
                    await setTimeout(1000);
                    (await followerDiv.$("._a9--._ap36._a9-_")).click();
                    return true;
                }
                
                matchedUsers++;
            }
        } while (followerDivs.length > 0);

        return false;
    }
}