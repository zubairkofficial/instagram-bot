"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionController = void 0;
class ExceptionController {
    handle(error, req, res, next) {
        console.log(error);
        res.json({ success: false });
    }
}
exports.ExceptionController = ExceptionController;
//# sourceMappingURL=exception-controller.js.map