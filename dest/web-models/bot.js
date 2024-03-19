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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cookiesButton = yield this.page.waitForSelector("._a9--._ap36._a9_0");
                yield cookiesButton.click();
                yield (0, promises_1.setTimeout)(2000);
            }
            catch (_b) { }
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
            catch (_c) { }
            const recaptchaCheckbox = yield ((_a = this
                .page
                .frames()
                .find(frame => frame.url().toString().startsWith("https://www.google.com/recaptcha"))) === null || _a === void 0 ? void 0 : _a.$(".recaptcha-checkbox"));
            yield (recaptchaCheckbox === null || recaptchaCheckbox === void 0 ? void 0 : recaptchaCheckbox.click());
            console.log(this.page.frames().map(frame => frame.url().toString()));
            yield (0, promises_1.setTimeout)(1500);
            yield this.page.screenshot({ path: 'screenshot.jpg' });
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