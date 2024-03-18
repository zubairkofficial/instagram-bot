"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const request_handler_1 = require("./server/request-handler");
new request_handler_1.RequestHandler();
console.log(`Server is listening at port: ${server_1.Server.PORT}`);
//# sourceMappingURL=index.js.map