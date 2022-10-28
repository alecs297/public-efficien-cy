
export async function get(ctx, next) {
    let rooms = ctx.scrapper.roomsAsList;
    let date = ctx.params.date ? new Date(parseInt(ctx.params.date) * 1000) : Date.now();

    ctx.body = rooms.map(room => room.getV0Preview(date))
}

export const custom_routes = [
    "list",
    "list/:date"
];