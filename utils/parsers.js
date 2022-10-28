import { HTTPError } from "./errors.js";

/**
 * @cf https://stackoverflow.com/a/1353711/13200376
 */
function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

function isValidIntString(n) {
    let p = parseInt(n);
    return `${p}` === n;
}

export function parseTimestamp(date) {
    let res = isValidIntString(date);

    if (res) {
        let parsed = new Date(parseInt(date));
        if (!isValidDate(parsed)) parsed = new Date(parseInt(date) * 1000);
        res = isValidDate(parsed)
    }

    if (!res) throw new HTTPError(400, "Invalid UNIX timestamp.");
}

export function parseInteger(n) {
    if (isValidIntString(n)) return parseInt(n);
    throw new HTTPError(400, "Invalid integer")
}

export function parseIntegerBetween(n, min, max) {
    n = parseInteger(n);
    if (n >= min && n<=max) return n;
    throw new HTTPError(400, "Integer out of range.")
}

export function parsePositiveInteger(n) {
    return parseIntegerBetween(n, 0, Infinity);
}

export function parseBoolean(b) {
    try {
        b = parseIntegerBetween(b, 0, 1);
    } catch (error) {
        b = b.toLowerCase() === "true" ? true : (b.toLowerCase() === false ? false : null)
    }
    if (b === null) throw new HTTPError(400, "Invalid boolean");
    return !!b;
}