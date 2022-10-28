import { parseTimestamp, parseIntegerBetween, parsePositiveInteger, parseBoolean } from "../../utils/parsers.js";
import Room from "../../utils/room.js";

export async function get(ctx, next) {
    let rooms = ctx.scrapper.roomsAsList;
    let date = ctx.query.date ? parseTimestamp(ctx.query.date) : Date.now();


    rooms = rooms.filter(Room.advancedFilter(date, {
        floor: ctx.query.floor ? parseIntegerBetween(ctx.query.floor, 0, 2) : null,
        delta: ctx.query.delta ? parsePositiveInteger(ctx.query.delta) * 1000 : -Infinity,
        capacity: ctx.query.capacity ? parsePositiveInteger(ctx.query.capacity) : 0,
        available: ctx.query.available ? parseBoolean(ctx.query.available) : null,

    }))

    ctx.body = rooms.map(room => room.getPreview(date))
}