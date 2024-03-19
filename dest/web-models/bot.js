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
const promises_1 = require("fs/promises");
const puppeteer_starter_1 = require("./puppeteer-starter");
const follower_1 = require("./follower");
class Bot extends puppeteer_starter_1.PuppeteerStarter {
    constructor(data) {
        const url = "https://www.instagram.com";
        super(url);
        this.data = data;
        this.url = url;
    }
    afterStart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.follower = new follower_1.Follower(this.page, this.data.targetUsername);
        });
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
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
            catch (_a) {
                console.log("Error in waiting for navigation after login. See screenshot.");
                yield this.page.screenshot({ path: 'screenshot.jpg' });
                (0, promises_1.writeFile)('body.html', yield this.page.evaluate(() => document.body.innerHTML));
            }
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