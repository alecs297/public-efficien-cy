class ICalEvent {
    constructor (event) {
        Object.keys(event).forEach(key => this[key] = event[key])
    }

    getOccuring(date=null) {
        if (!date) date = Date.now();
        return (this.start <= date && this.end >= date)
    }

    get public() {
        return {
            start: this.start,
            end: this.end
        }
    }

    static sort(a, b) {
        return a.start === b.start ? 0 : (a.start < b.start ? -1 : 1);
    }

}

export default ICalEvent;