import { Request, Response } from "express";
import { Bot } from "../web-models/bot";
import { InstagramData } from "../web-models/instagram-data";

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

export interface IScreenshotParams {
    botId: string
}

export class FollowController {
    private bots: Bot[] = [];

    private botRunning(id: number) {
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

        this.bots[botId].data.targetUsername = targetUsername;
        res.json({ success: true });
    }

    public async getFollowersList(req: Request, res: Response) {
        const { botId } = req.body as IGetFollowersListBody;
        if (!this.botRunning(botId)) return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });

        const followerList = await this.bots[botId].follower.getList();
        res.json({ success: true, followerList });
    }

    public async follow(req: Request, res: Response) {
        const { botId, maxFollowers } = req.body as IFollowBody;
        if (!this.botRunning(botId)) return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });

        const result = await this.bots[botId].follower.startFollowing(maxFollowers);
        res.json({ success: true, ...result });
    }

    public async unfollow(req: Request, res: Response) {
        const { botId, usernameToUnfollow } = req.body as IUnfollowBody;
        if (!this.botRunning(botId)) return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });

        const success = await this.bots[botId].follower.unfollow(usernameToUnfollow);
        res.json({ success });
    }

    public async disconnect(req: Request, res: Response) {
        const { botId } = req.body as IDisconnectBody;
        if (!this.botRunning(botId)) return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });

        await this.bots[botId].close();
        this.bots[botId] = null;
        res.json({ success: true });
    }

    public async screenshot(req: Request, res: Response) {
        const botId = parseInt(req.params.botId);
        if (!this.botRunning(botId)) return res.json({ success: false, error: "BOT_NOT_RUNNUNG" });

        const screenshot = await this.bots[botId].screenshot();
        res.contentType(".jpg").send(screenshot);
    }
}