import { parseTimestamp } from "../../utils/parsers.js";
import { HTTPError } from "../../utils/errors.js";

export async function get(ctx, next) {
    let rooms = ctx.scrapper.roomsAsDict;
    let date = ctx.query.date ? parseTimestamp(ctx.query.date) : Date.now();

    if (!rooms.hasOwnProperty(ctx.params.room)) throw new HTTPError(404, "Room not found");

    ctx.body = rooms[ctx.params.room].getPublic(date);
}

export const custom_routes = [
    "get/:room"
];