"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHandler = void 0;
const server_1 = require("./server");
const follow_controller_1 = require("../controllers/follow-controller");
const exception_controller_1 = require("../controllers/exception-controller");
const ads_controller_1 = require("../controllers/ads-controller");
class RequestHandler extends server_1.Server {
    constructor() {
        super();
        this.route();
        this.start();
    }
    route() {
        const followController = new follow_controller_1.FollowController();
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
        const adsController = new ads_controller_1.AdsController();
        this.app.post('/run-ad', adsController.runAd.bind(adsController));
        this.app.post('/schedule-ad', adsController.scheduleAd.bind(adsController));
        this.app.get('/analytics', adsController.getAnalytics.bind(adsController));
        const exceptionController = new exception_controller_1.ExceptionController();
        this.app.use(exceptionController.handle.bind(exceptionController));
    }
}
exports.RequestHandler = RequestHandler;
//# sourceMappingURL=request-handler.js.map