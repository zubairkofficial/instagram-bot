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
const promises_1 = __importDefault(require("fs/promises"));
const bot_1 = require("./web-models/bot");
const instagram_data_1 = require("./web-models/instagram-data");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = instagram_data_1.InstagramData.getForTesting();
        console.log("Starting the bot.");
        const bot = new bot_1.Bot(data);
        yield bot.start();
        console.log("Logging In");
        yield bot.login();
        // while (!await data.isLoggedIn()) 
        //     console.log("Please login to start further processing.");
        // console.log("Starting to follow.");
        // const followedCount = await bot.follower.startFollowing(data.maxFollowers);
        // console.log(`You are now following ${followedCount} followers of ${data.targetUsername}. Enjoy!`);
        const followers = yield bot.targetAccount.getList();
        console.log(followers);
        promises_1.default.writeFile("result.json", JSON.stringify(followers));
        yield bot.close();
    });
}
main();
//# sourceMappingURL=test.js.map