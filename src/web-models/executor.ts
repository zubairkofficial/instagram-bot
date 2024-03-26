import { setTimeout } from 'timers/promises';
import { Page, ElementHandle } from "puppeteer";

interface IFollowingUser {
    username: string,
    buttonText: string
}

export abstract class Executor {
    protected abstract page: Page;

    protected async follow(maxFollowers: number) {
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

    protected async list() {
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
                        'fullName': elm.querySelector(".x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft")?.textContent || "",
                        'buttonText': elm.querySelector('button').textContent.trim(),
                        'imageUrl': elm.querySelector('img').src
                    })
                );

                list.push(followerInfo);
            }
        } while (followerDivs.length > 0);

        return list;
    }

    protected async unfollow(usernameToUnfollow: string) {
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

    protected async clickButton(usernameToClick: string) {
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

                if (usernameToClick === username) {
                    (await followerDiv.$("button")).click();
                    return true;
                }
                
                matchedUsers++;
            }
        } while (followerDivs.length > 0);

        return false;
    }
}