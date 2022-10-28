export async function get(ctx, next) {
    let rooms = ctx.scrapper.roomsAsDict;
    let date = ctx.params.date ? new Date(parseInt(ctx.params.date) * 1000) : Date.now();

    ctx.body = ctx.params.room in rooms ? rooms[ctx.params.room].getV0Preview(date) : null
}

export const custom_routes = [
    "get",
    "get/:room",
    "get/:room/:time"
];