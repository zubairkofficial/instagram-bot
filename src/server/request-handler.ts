import { Server } from "./server";
import { FollowController } from "../controllers/follow-controller";
import { ExceptionController } from "../controllers/exception-controller";

export class RequestHandler extends Server {
    constructor() {
        super();
        this.routeForDebugging();
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
        
        const exceptionController = new ExceptionController();
        this.app.use(exceptionController.handle.bind(exceptionController));
    }

    public routeForDebugging() {
        this.app.get('/screenshot', (req, res) => {
            res.download('screenshot.jpg');
        })
    }
}