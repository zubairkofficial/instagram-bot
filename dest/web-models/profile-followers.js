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
exports.ProfileFollowers = void 0;
const executor_1 = require("./executor");
class ProfileFollowers extends executor_1.Executor {
    constructor(page, username) {
        super();
        this.page = page;
        this.username = username;
    }
    goToPage() {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `https://www.instagram.com/${this.username}/followers`;
            // if (which === "following") url = `https://www.instagram.com/${this.username}/following`;
            let currentUrl = this.page.url();
            if (currentUrl.endsWith('/'))
                currentUrl = currentUrl.substring(0, currentUrl.length - 1);
            if (url === currentUrl)
                return;
            yield this.page.goto(url, {
                waitUntil: 'networkidle0',
            });
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.goToPage();
            return yield this.list();
        });
    }
}
exports.ProfileFollowers = ProfileFollowers;
//# sourceMappingURL=profile-followers.js.map