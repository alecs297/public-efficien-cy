import Event from "../utils/event.js"
import ICalEvent from "./event.js";

class Room {
    constructor (name) {
        this.name = name;
        this.events = [];
    }

    get campus() {
        return this.name.split(" ")[0];
    }

    get code() {
        return this.name.split(" ")[1];
    }

    get number() {
        return parseInt(this.code.slice(1));
    }

    get floor() {
        return this.code.startsWith("A") ? 0 : Math.floor(parseInt(this.code.slice(1) / 100))
    }

    get capacity() {

        if (!this.hasCustomName) return null;
        
        let indicator = this.name.split(" ").slice(-1)[0];

        if (!indicator.endsWith("p")) return null;

        return parseInt(indicator);
    }

    addEvent(event) {
        if (!(event instanceof ICalEvent)) event = new ICalEvent(event);
        this.events.push(event);
    }

    getCurrentEvents(date=null) {
        if (!date) date = Date.now();
        return this.events.filter(event => event.getOccuring(date)).map(event => event.public);
    }

    getNextEvent(date=null) {
        if (!date) date = Date.now();
        let closest = null;
        let min_delta = Infinity;
        this.events.forEach(event => {
            let delta = event.start - date;
            if (delta > 0 && delta < min_delta) {
                min_delta = delta;
                closest = event
            }
        })
        return {
            delta: min_delta,
            event: closest ? closest.public : null
        }
    }

    getNextEvents(date=null) {
        if (!date) date = Date.now();
        return this.events.filter(event => new Date(event.start) > date);
    }

    getPreview(date=null) {
        if (!date) date = Date.now();

        let currentEvents = this.getCurrentEvents(date)

        return {
            name: this.name,
            code: this.code,
            number: this.number,
            floor: this.floor,
            capacity: this.capacity,
            available: !currentEvents.length,
            currentEvents: currentEvents,
            nextEvent: this.getNextEvent(date)
        }
    }

    getV0Preview(date=null) {
        return {
            ...this.getPreview(date),
            occupied: !this.getPreview(date).available
        }
    }

    getPublic(date=null) {
        return {
            ...this.getPreview(date),
            nextEvents: this.getNextEvents().map(event => event.public).sort(Event.sort).slice(0, 10)
        }
    }

    get hasCustomName() {
        return `${this.campus} ${this.code}` !== this.name;
    }

    static sort(date=null) {
        if (!date) date = Date.now();
        return (a, b) => {
            const e_a = a.getNextEvent(date).delta;
            const e_b = b.getNextEvent(date).delta;
            const delta = e_a === e_b ? 0 : ((e_a > e_b) ? -1 : 1)

            return a.hasCustomName === b.hasCustomName ? delta : (a.hasCustomName ? -1 : 1)
        }
    }

    static advancedFilter(date, {floor=null, delta=-Infinity, capacity=0, available=null}) {

        if (!date) date = Date.now();
        
        return (room) => {

            if (floor !== null && floor !== room.floor) return false;
            if (room.getNextEvent(date).delta < delta) return false;
            if (room.capacity !== null && room.capacity <= capacity) return false;
            if (available !== null) return (room.getPreview(date).available === available)

            return true;
        }
    }

}

export default Room