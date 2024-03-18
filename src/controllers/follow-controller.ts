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

export class FollowController {
    private bots: Bot[] = [];

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
        this.bots[botId].data.targetUsername = targetUsername;
        res.json({ success: true });
    }

    public async getFollowersList(req: Request, res: Response) {
        const { botId } = req.body as IGetFollowersListBody;
        const followerList = await this.bots[botId].follower.getList();
        res.json({ success: true, followerList });
    }

    public async follow(req: Request, res: Response) {
        const { botId, maxFollowers } = req.body as IFollowBody;
        const result = await this.bots[botId].follower.startFollowing(maxFollowers);
        res.json({ success: true, ...result });
    }

    public async unfollow(req: Request, res: Response) {
        const { botId, usernameToUnfollow } = req.body as IUnfollowBody;
        const success = await this.bots[botId].follower.unfollow(usernameToUnfollow);
        res.json({ success });
    }

    public async disconnect(req: Request, res: Response) {
        const { botId } = req.body as IDisconnectBody;
        await this.bots[botId].close();
        this.bots[botId] = null;
        res.json({ success: true });
    }
}