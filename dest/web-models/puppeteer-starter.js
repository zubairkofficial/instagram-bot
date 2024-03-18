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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppeteerStarter = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class PuppeteerStarter {
    constructor(url) {
        this.url = url;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield puppeteer_1.default.launch({
                defaultViewport: null,
                headless: true
            });
            this.page = yield this.browser.newPage();
            yield this.page.goto(this.url, {
                waitUntil: 'networkidle0',
            });
            yield this.afterStart();
        });
    }
}
exports.PuppeteerStarter = PuppeteerStarter;
//# sourceMappingURL=puppeteer-starter.js.map