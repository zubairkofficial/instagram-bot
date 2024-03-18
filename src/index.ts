import { Server } from "./server/server";
import { RequestHandler } from "./server/request-handler";

new RequestHandler();
console.log(`Server is listening at port: ${Server.PORT}`);