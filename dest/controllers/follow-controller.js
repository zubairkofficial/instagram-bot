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
exports.FollowController = void 0;
const bot_1 = require("../web-models/bot");
const instagram_data_1 = require("../web-models/instagram-data");
const locker_1 = require("../helpers/locker");
class FollowController {
    constructor() {
        this.bots = [];
        this.locker = new locker_1.Locker();
    }
    botRunning(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.locker.whenUnlocked(id);
            return this.bots[id] ? true : false;
        });
    }
    connect(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = instagram_data_1.InstagramData.getFromObject(req.body);
            const bot = new bot_1.Bot(data);
            yield bot.start();
            yield bot.login();
            this.bots.push(bot);
            const botId = this.bots.length - 1;
            res.json({ success: true, botId });
        });
    }
    addTargetAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botId, targetUsername } = req.body;
            if (!this.botRunning(botId))
                return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });
            this.locker.lock(botId);
            this.bots[botId].targetUsername = targetUsername;
            res.json({ success: true });
            this.locker.unlock(botId);
        });
    }
    getFollowersList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botId } = req.body;
            if (!this.botRunning(botId))
                return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });
            this.locker.lock(botId);
            const followerList = yield this.bots[botId].targetAccount.getList();
            res.json({ success: true, followerList });
            this.locker.unlock(botId);
        });
    }
    follow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botId, maxFollowers } = req.body;
            if (!this.botRunning(botId))
                return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });
            this.locker.lock(botId);
            const result = yield this.bots[botId].targetAccount.startFollowing(maxFollowers);
            res.json(Object.assign({ success: true }, result));
            this.locker.unlock(botId);
        });
    }
    unfollow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botId, usernameToUnfollow } = req.body;
            if (!this.botRunning(botId))
                return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });
            this.locker.lock(botId);
            const success = yield this.bots[botId].targetAccount.unfollowUser(usernameToUnfollow);
            res.json({ success });
            this.locker.unlock(botId);
        });
    }
    disconnect(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botId } = req.body;
            if (!this.botRunning(botId))
                return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });
            this.locker.lock(botId);
            yield this.bots[botId].close();
            this.bots[botId] = null;
            res.json({ success: true });
            this.locker.unlock(botId);
        });
    }
    myFollowers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botId } = req.body;
            if (!this.botRunning(botId))
                return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });
            this.locker.lock(botId);
            const followers = yield this.bots[botId].profile.getFollowers();
            res.json({ success: true, followers });
            this.locker.unlock(botId);
        });
    }
    myFollowings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botId } = req.body;
            if (!this.botRunning(botId))
                return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });
            this.locker.lock(botId);
            const following = yield this.bots[botId].profile.getFollowing();
            res.json({ success: false, following });
            this.locker.unlock(botId);
        });
    }
    screenshot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const botId = parseInt(req.params.botId);
            if (!this.botRunning(botId))
                return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });
            const image = yield this.bots[botId].screenshot();
            res.contentType(".jpg").send(image);
        });
    }
    html(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const botId = parseInt(req.params.botId);
            if (!this.botRunning(botId))
                return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });
            const code = yield this.bots[botId].html();
            res.contentType(".html").send(code);
        });
    }
}
exports.FollowController = FollowController;
//# sourceMappingURL=follow-controller.js.map