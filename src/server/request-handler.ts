import { Server } from "./server";
import { FollowController } from "../controllers/follow-controller";
import { ExceptionController } from "../controllers/exception-controller";
import { AdsController } from "../controllers/ads-controller";

export class RequestHandler extends Server {
    constructor() {
        super();
        this.route();
        this.start();
    }

    public route() {
        const followController = new FollowController();
        this.app.post('/connect', followController.connect.bind(followController));
        this.app.post('/add-target-account', followController.addTargetAccount.bind(followController));
        this.app.post('/get-followers-list', followController.getFollowersList.bind(followController));
        this.app.post('/follow', followController.follow.bind(followController));
        this.app.post('/unfollow', followController.unfollow.bind(followController));
        this.app.post('/disconnect', followController.disconnect.bind(followController));
        this.app.post('/my-followers', followController.myFollowers.bind(followController));
        this.app.post('/my-following', followController.myFollowings.bind(followController));
        this.app.get('/screenshot/:botId', followController.screenshot.bind(followController));
        this.app.get('/code/:botId', followController.html.bind(followController));

        const adsController = new AdsController();
        this.app.post('/run-ad', adsController.runAd.bind(adsController));
        this.app.post('/schedule-ad', adsController.scheduleAd.bind(adsController));
        this.app.get('/analytics', adsController.getAnalytics.bind(adsController));
        
        const exceptionController = new ExceptionController();
        this.app.use(exceptionController.handle.bind(exceptionController));
    }
}