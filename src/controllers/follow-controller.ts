import { Request, Response } from "express";
import { Bot } from "../web-models/bot";
import { InstagramData } from "../web-models/instagram-data";
import { Locker } from "../helpers/locker";

export interface IAddTargetAccountBody {
    botId: number,
    targetUsername: string
}

export interface IGetFollowersListBody {
    botId: number
}

export interface IFollowBody {
    botId: number,
    maxFollowers: number
}

export interface IUnfollowBody {
    botId: number,
    usernameToUnfollow: string
}

export interface IDisconnectBody {
    botId: number
}

export interface IMyFollowingsBody {
    botId: number
}

export interface IMyFollowersBody {
    botId: number
}

export class FollowController {
    private bots: Bot[] = [];
    private locker: Locker = new Locker();

    private async botRunning(id: number) {
        await this.locker.whenUnlocked(id);
        return this.bots[id] ? true : false;
    }

    public async connect(req: Request, res: Response) {
        const data = InstagramData.getFromObject(req.body);
        const bot = new Bot(data);
        await bot.start();
        await bot.login();
        this.bots.push(bot);

        const botId = this.bots.length - 1;
        res.json({ success: true, botId });
    }

    public async addTargetAccount(req: Request, res: Response) {
        const { botId, targetUsername } = req.body as IAddTargetAccountBody;
        if (!this.botRunning(botId)) return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });

        this.locker.lock(botId);
        this.bots[botId].targetUsername = targetUsername;
        res.json({ success: true });
        this.locker.unlock(botId);
    }

    public async getFollowersList(req: Request, res: Response) {
        const { botId } = req.body as IGetFollowersListBody;
        if (!this.botRunning(botId)) return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });

        this.locker.lock(botId);
        const followerList = await this.bots[botId].targetAccount.getList();
        res.json({ success: true, followerList });
        this.locker.unlock(botId);
    }

    public async follow(req: Request, res: Response) {
        const { botId, maxFollowers } = req.body as IFollowBody;
        if (!this.botRunning(botId)) return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });

        this.locker.lock(botId);
        const result = await this.bots[botId].targetAccount.startFollowing(maxFollowers);
        res.json({ success: true, ...result });
        this.locker.unlock(botId);
    }

    public async unfollow(req: Request, res: Response) {
        const { botId, usernameToUnfollow } = req.body as IUnfollowBody;
        if (!this.botRunning(botId)) return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });

        this.locker.lock(botId);
        const success = await this.bots[botId].targetAccount.unfollowUser(usernameToUnfollow);
        res.json({ success });
        this.locker.unlock(botId);
    }

    public async disconnect(req: Request, res: Response) {
        const { botId } = req.body as IDisconnectBody;
        if (!this.botRunning(botId)) return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });

        this.locker.lock(botId);
        await this.bots[botId].close();
        this.bots[botId] = null;
        res.json({ success: true });
        this.locker.unlock(botId);
    }

    public async myFollowers(req: Request, res: Response) {
        const { botId } = req.body as IMyFollowersBody;
        if (!this.botRunning(botId)) return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });
        
        this.locker.lock(botId);
        const followers = await this.bots[botId].profile.getFollowers();
        res.json({ success: true, followers });
        this.locker.unlock(botId);
    }

    public async myFollowings(req: Request, res: Response) {
        const { botId } = req.body as IMyFollowingsBody;
        if (!this.botRunning(botId)) return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });

        this.locker.lock(botId);
        const following = await this.bots[botId].profile.getFollowing();
        res.json({ success: false, following });
        this.locker.unlock(botId);
    }

    public async screenshot(req: Request, res: Response) {
        const botId = parseInt(req.params.botId);
        if (!this.botRunning(botId)) return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });

        const image = await this.bots[botId].screenshot();
        res.contentType(".jpg").send(image);
    }

    public async html(req: Request, res: Response) {
        const botId = parseInt(req.params.botId);
        if (!this.botRunning(botId)) return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });

        const code = await this.bots[botId].html();
        res.contentType(".html").send(code);
    }
}