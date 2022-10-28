import * as dotenv from "dotenv";
import Koa from "koa";
import Router from "koa-router";
import ApiRouter from "./utils/api.js";
import { ErrorHandler } from "./utils/errors.js";
import Scrapper from "./utils/scrapper.js";

import { createReadStream } from "fs"

// port and hostname are loaded from the env
dotenv.config();


const settings = {
    port: process.env.PORT || 3000,
    hostname: process.env.HOSTNAME || "localhost"
}

const app = new Koa();
const router = new Router();
const scrapper = new Scrapper();

app.context.scrapper = scrapper;

new ErrorHandler(app);

const api = new ApiRouter(router);
await api.init();

router.get("/", (ctx, next) => {
    ctx.type = 'html'
    ctx.body = createReadStream("./html/home.html");
})

router.get("/clean.css", (ctx, next) => {
    ctx.type = 'css'
    ctx.body = createReadStream("./css/clean.css");
})

router.get("/docs", (ctx, next) => {
    ctx.type = 'html'
    ctx.body = createReadStream("./documentation/v1.html");
})

app.use(router.routes());
app.use(router.allowedMethods());


app.listen(
    settings.port,
    settings.hostname,
    undefined,
    () => {
        console.log(`${api.routes.length} routes loaded. Listening on http://${settings.hostname}:${settings.port}`)
        scrapper.update();
        setInterval(async () => {
            scrapper.update();
        }, 60 * 60 * 1000)
    }
);