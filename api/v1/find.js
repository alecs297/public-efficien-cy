import { parseTimestamp, parseIntegerBetween, parsePositiveInteger } from "../../utils/parsers.js";
import Room from "../../utils/room.js"

export async function get(ctx, next) {
    let rooms = ctx.scrapper.filteredRoomsAsList;
    let date = ctx.query.date ? parseTimestamp(ctx.query.date) : Date.now();

    // Keep only available rooms
    rooms = rooms.filter(room => !room.getCurrentEvents(date).length)
    // Apply query filters
        .filter(Room.advancedFilter(date, {
            floor: ctx.query.floor ? parseIntegerBetween(ctx.query.floor, 0, 2) : null,
            delta: ctx.query.delta ? parsePositiveInteger(ctx.query.delta) * 1000 : -Infinity,
            capacity: ctx.query.capacity ? parsePositiveInteger(ctx.query.capacity) : 0
        }))

    // Sort by longest available
    rooms.sort(Room.sort(date));

    let candidates = rooms.map(room => room.getPreview(date));

    // Get random room from top 3
    ctx.body = candidates[Math.floor(Math.random() * Math.min(3, candidates.length))];
}