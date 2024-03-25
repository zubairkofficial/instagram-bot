"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Locker = void 0;
const events_1 = __importDefault(require("events"));
class Locker extends events_1.default {
    constructor() {
        super();
        this.lockedIds = [];
    }
    isLocked(id) {
        this.lockedIds.includes(id);
    }
    lock(id) {
        this.lockedIds.push(id);
    }
    unlock(id) {
        this.lockedIds.filter(lockedId => lockedId !== id);
        this.emit(`unlocked-${id}`);
    }
    whenUnlocked(id) {
        if (!this.lockedIds.includes(id))
            return;
        return new Promise(resolve => {
            this.once(`unlocked-${id}`, resolve);
        });
    }
}
exports.Locker = Locker;
//# sourceMappingURL=locker.js.map