"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Follower = void 0;
const promises_1 = require("timers/promises");
class Follower {
    constructor(page, targetUsername) {
        this.page = page;
        this.targetUsername = targetUsername;
        this.url = `https://www.instagram.com/${this.targetUsername}/followers`;
    }
    goToPage() {
        return __awaiter(this, void 0, void 0, function* () {
            let currentUrl = this.page.url();
            if (currentUrl.endsWith('/'))
                currentUrl = currentUrl.substring(0, currentUrl.length - 1);
            if (this.url === currentUrl)
                return;
            yield this.page.goto(this.url, {
                waitUntil: 'networkidle0',
            });
        });
    }
    startFollowing(maxFollowers) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.goToPage();
            yield (0, promises_1.setTimeout)(3000);
            const buttonsSelector = ".x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3 button";
            let followedCount = 0, nowFollowed = 0;
            const followedAccounts = [];
            outerLoop: while (true) {
                const followButtons = (yield this.page.$$(buttonsSelector)).slice(followedCount);
                if (followButtons.length === 0)
                    break;
                for (const button of followButtons) {
                    if (nowFollowed >= maxFollowers)
                        break outerLoop;
                    yield button.scrollIntoView();
                    const buttonText = yield button.evaluate(el => el.textContent);
                    if (buttonText.trim() === "Follow") {
                        yield button.click();
                        yield (0, promises_1.setTimeout)(1000);
                        nowFollowed++;
                        const followedAccount = yield button.evaluate(btn => btn
                            .closest(".x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3")
                            .querySelector("._ap3a._aaco._aacw._aacx._aad7._aade")
                            .textContent);
                        followedAccounts.push(followedAccount);
                    }
                    followedCount++;
                }
                yield (0, promises_1.setTimeout)(5000);
            }
            return { nowFollowed, followedAccounts };
        });
    }
    getList() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.goToPage();
            const followerSelector = ".x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3";
            let followerDivs = [];
            const list = [];
            do {
                yield (0, promises_1.setTimeout)(5000);
                yield this.page.screenshot({ path: 'screenshot.jpg' });
                followerDivs = (yield this.page.$$(followerSelector)).splice(list.length);
                for (const followerDiv of followerDivs) {
                    followerDiv.scrollIntoView();
                    const followerInfo = yield followerDiv.evaluate(elm => ({
                        'username': elm.querySelector("._ap3a._aaco._aacw._aacx._aad7._aade").textContent,
                        'buttonText': elm.querySelector('button').textContent.trim()
                    }));
                    list.push(followerInfo);
                }
            } while (followerDivs.length > 0);
            return list;
        });
    }
    unfollow(usernameToUnfollow) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.goToPage();
            const followerSelector = ".x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3";
            let followerDivs = [];
            let matchedUsers = 0;
            do {
                yield (0, promises_1.setTimeout)(5000);
                followerDivs = (yield this.page.$$(followerSelector)).splice(matchedUsers);
                for (const followerDiv of followerDivs) {
                    followerDiv.scrollIntoView();
                    const username = yield followerDiv.evaluate(elm => elm.querySelector("._ap3a._aaco._aacw._aacx._aad7._aade").textContent);
                    if (usernameToUnfollow === username) {
                        (yield followerDiv.$("button")).click();
                        yield (0, promises_1.setTimeout)(1000);
                        (yield followerDiv.$("._a9--._ap36._a9-_")).click();
                        return true;
                    }
                    matchedUsers++;
                }
            } while (followerDivs.length > 0);
            return false;
        });
    }
}
exports.Follower = Follower;
//# sourceMappingURL=follower.js.map