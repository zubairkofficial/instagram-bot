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
exports.TargetAccount = void 0;
const promises_1 = require("timers/promises");
const executor_1 = require("./executor");
class TargetAccount extends executor_1.Executor {
    constructor(page, targetUsername) {
        super();
        this.page = page;
        this.targetUsername = targetUsername;
    }
    get url() {
        return `https://www.instagram.com/${this.targetUsername}/followers`;
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
            return yield this.follow(maxFollowers);
        });
    }
    getList() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.goToPage();
            return yield this.list();
        });
    }
    unfollowUser(usernameToUnfollow) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.goToPage();
            return yield this.unfollow(usernameToUnfollow);
        });
    }
}
exports.TargetAccount = TargetAccount;
//# sourceMappingURL=target-account.js.map