import ical from "node-ical";
import Room from "./room.js";

const blacklistedRooms = [
    // rooms not to be suggested but still showed
]

function celcatLinksGenerator() {
    return console.error("Change this function to a function returning an array of urls")
}

function roomsGenerator() {
    const rooms = [ "PAU A001" ];
    for (let i = 1; i <= 10; i++) {
        rooms.push("PAU E" + (100 + i))
    }
    for (let i = 1; i <= 18; i++) {
        if (i < 2 || i > 8) rooms.push("PAU E" + (200 + i))
    }
    return rooms
}

class Scrapper {
    
    constructor (links_generator=celcatLinksGenerator) {
        this.links = typeof links_generator === "object" ? links_generator : links_generator();
        this.events = null;
    }

    async download() {
        this.calendars = await Promise.all(this.links.map(async link => {
            return {...(await ical.async.fromURL(link.url)), group: link.group}
        }))
        console.info(`Fetched ${this.links.length} calendars.`);
    }

    parse() {
        let events = [];
        let roomDict = {};
        
        roomsGenerator().forEach(room => {
            let temp = new Room(room);
            roomDict[temp.code] = temp;
        });

        this.calendars.forEach(calendar => {
            delete calendar.vcalendar;
            events = events.concat(Object.values(calendar).map(event => {
                return {...event, group: calendar.group}
            }))
        })

        events.forEach(event => {
            if (event.location) {
                let room = new Room(event.location);
                if (room.name && room.campus.toUpperCase() === "PAU") {
                    if (room.code in roomDict) {
                        if (!roomDict[room.code].hasCustomName) roomDict[room.code].name = event.location;
                        roomDict[room.code].addEvent(event);
                    } else {
                        console.warn(room.code + " not in default rooms");
                    }
                }
            }
        })

        this.rooms = roomDict;
        console.info(`Parsed ${events.length} events for ${this.roomsAsList.length} rooms.`)
    }

    get roomsAsList() {
        return Object.values(this.rooms).filter(room => room);
    }

    get filteredRoomsAsList() {
        return this.roomsAsList.filter(room => !blacklistedRooms.includes(room.code))
    }

    get roomsAsDict() {
        return this.rooms;
    }

    get filteredRoomsAsDict() {
        let rooms = [];
        this.filteredRoomsAsList.forEach(room => rooms[room.code] = room);
        return rooms;
    }

    async update() {
        await this.download();
        this.parse();
    }


}

export default Scrapper;