import Room from "../../utils/room.js"


export async function get(ctx, next) {
    let rooms = ctx.scrapper.filteredRoomsAsList;
    let date = ctx.params.date ? new Date(parseInt(ctx.params.date) * 1000) : Date.now();

    // Keep only available rooms
    rooms = rooms.filter(room => !room.getCurrentEvents(date).length)

    // Sort by longest available
    rooms.sort(Room.sort(date));

    let candidates = rooms.map(room => room.getV0Preview(date));

    // Get random room from top 3
    ctx.body = candidates.length ? [ candidates[Math.floor(Math.random() * Math.min(3, candidates.length))] ] : []
}

export const custom_routes = [
    "find",
    "find/:date"
];
