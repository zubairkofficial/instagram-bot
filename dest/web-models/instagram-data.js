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
exports.InstagramData = void 0;
const promises_1 = require("readline/promises");
class InstagramData {
    static getFromConsole() {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new InstagramData();
            instance.username = yield this.consoleInterface.question("Enter Username/Email: ");
            instance.password = yield this.consoleInterface.question("Enter Password: ");
            instance.targetUsername = yield this.consoleInterface.question("Enter the username of target account: ");
            instance.maxFollowers = parseInt(yield this.consoleInterface.question("Number of maximum accounts to follow: "));
            return instance;
        });
    }
    static getFromObject(info) {
        const instance = new InstagramData();
        instance.username = (info === null || info === void 0 ? void 0 : info.username) || "";
        instance.password = (info === null || info === void 0 ? void 0 : info.password) || "";
        instance.targetUsername = (info === null || info === void 0 ? void 0 : info.targetUsername) || "";
        instance.maxFollowers = (info === null || info === void 0 ? void 0 : info.maxFollowers) || 0;
        return instance;
    }
    static getForTesting() {
        const instance = new InstagramData();
        instance.username = "farrukhsial@outlook.com";
        instance.password = "Farrukh@59$";
        instance.targetUsername = "iqrarulhassan";
        instance.maxFollowers = 3;
        return instance;
    }
}
exports.InstagramData = InstagramData;
InstagramData.consoleInterface = (0, promises_1.createInterface)({
    input: process.stdin,
    output: process.stdout
});
//# sourceMappingURL=instagram-data.js.map