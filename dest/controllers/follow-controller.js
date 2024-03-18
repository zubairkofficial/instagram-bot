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
class FollowController {
    constructor() {
        this.bots = [];
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
            this.bots[botId].data.targetUsername = targetUsername;
            res.json({ success: true });
        });
    }
    getFollowersList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botId } = req.body;
            const followerList = yield this.bots[botId].follower.getList();
            res.json({ success: true, followerList });
        });
    }
    follow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botId, maxFollowers } = req.body;
            const result = yield this.bots[botId].follower.startFollowing(maxFollowers);
            res.json(Object.assign({ success: true }, result));
        });
    }
    unfollow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botId, usernameToUnfollow } = req.body;
            const success = yield this.bots[botId].follower.unfollow(usernameToUnfollow);
            res.json({ success });
        });
    }
    disconnect(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botId } = req.body;
            yield this.bots[botId].close();
            this.bots[botId] = null;
            res.json({ success: true });
        });
    }
}
exports.FollowController = FollowController;
//# sourceMappingURL=follow-controller.js.map