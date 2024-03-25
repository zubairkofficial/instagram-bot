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
exports.Bot = void 0;
const promises_1 = require("timers/promises");
const puppeteer_starter_1 = require("./puppeteer-starter");
const target_account_1 = require("./target-account");
const profile_followers_1 = require("./profile-followers");
const profile_following_1 = require("./profile-following");
class Bot extends puppeteer_starter_1.PuppeteerStarter {
    constructor(data) {
        const url = "https://www.instagram.com";
        super(url);
        this.data = data;
        this.url = url;
    }
    get targetUsername() {
        return this.data.targetUsername;
    }
    set targetUsername(newUsername) {
        this.targetAccount.targetUsername = this.data.targetUsername = newUsername;
    }
    afterStart() {
        return __awaiter(this, void 0, void 0, function* () {
            const targetAccountPage = yield this.browser.newPage();
            this.targetAccount = new target_account_1.TargetAccount(targetAccountPage, this.data.targetUsername);
            const profilePage1 = yield this.browser.newPage();
            this.profileFollowers = new profile_followers_1.ProfileFollowers(profilePage1, this.data.username);
            const profilePage2 = yield this.browser.newPage();
            this.profileFollowing = new profile_following_1.ProfileFollowing(profilePage2, this.data.username);
        });
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.page.screenshot();
                const cookiesButton = yield this.page.waitForSelector("._a9--._ap36._a9_0", {
                    timeout: 5000
                });
                yield cookiesButton.click();
                yield (0, promises_1.setTimeout)(1000);
            }
            catch (_a) { }
            const loginInput = yield this.page.waitForSelector("[name='username']");
            const passwordInput = yield this.page.waitForSelector("[name='password']");
            const loginButton = yield this.page.waitForSelector("form [type='submit']");
            yield loginInput.type(this.data.username);
            yield passwordInput.type(this.data.password);
            yield loginButton.click();
            try {
                yield this.page.waitForNavigation({
                    waitUntil: 'networkidle0',
                });
            }
            catch (_b) { }
            for (const frame of this.page.mainFrame().childFrames()) {
                yield frame.solveRecaptchas();
            }
            try {
                const nextButton = yield this.page.waitForSelector("[role='button']");
                yield nextButton.click();
                yield this.page.waitForNavigation({
                    waitUntil: 'networkidle0',
                });
            }
            catch (_c) { }
            yield (0, promises_1.setTimeout)(500);
        });
    }
    screenshot() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.page.screenshot({ fullPage: true });
        });
    }
    html() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.page.content();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.browser.close();
        });
    }
}
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map