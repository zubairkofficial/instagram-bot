import { Request, Response, NextFunction } from "express";

export class ExceptionController {
    public handle(error, req: Request, res: Response, next: NextFunction) {
        console.log(error);
        res.json({ success: false });
    }
}