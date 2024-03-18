import express, { Express } from "express";

export class Server {
    public app: Express;
    public static PORT = 80;

    constructor() {
        this.app = express();
        this.useMiddlewires();
    }

    public useMiddlewires() {
        this.app.use( express.json() );
        this.app.use( express.urlencoded({ extended: true }) );
    }

    public start() {
        this.app.listen(Server.PORT);
    }
}