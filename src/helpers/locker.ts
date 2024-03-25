import EventEmitter from "events";

export class Locker extends EventEmitter {
    private lockedIds: number[];

    constructor() {
        super();
        this.lockedIds = [];
    }

    public isLocked(id: number) {
        this.lockedIds.includes(id);
    }

    public lock(id: number) {
        this.lockedIds.push(id);
    }

    public unlock(id: number) {
        this.lockedIds.filter(lockedId => lockedId !== id);
        this.emit(`unlocked-${id}`);
    }

    public whenUnlocked(id: number) {
        if (!this.lockedIds.includes(id)) return;
        
        return new Promise(resolve => {
            this.once(`unlocked-${id}`, resolve)
        });
    }
}