import { createRequire } from "module";
const require = createRequire(import.meta.url)

export async function get(ctx, next) {
    ctx.body = require("../../documentation/v1.json")
}

export const custom_routes = [
    "swagger.json"
];