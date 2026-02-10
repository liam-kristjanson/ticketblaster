import { overwriteMiddlewareResult } from "mongoose";
import Event from "../src/models/Event";
import Ticket from "../src/models/Ticket";
import User from "../src/models/User";
import Venue from "../src/models/Venue";

let userCount = 0;
let venueCount = 0;
let eventCount = 0;
let ticketCount = 0;

export async function createUser(overrides = {}) {

    userCount++;

    return await User.create({
        username: "TestUser" + userCount,
        password: "Testuser123!",
        role: "customer",
        ...overrides
    });
}

export async function createVenue(owner : User, overrides = {}) {

    venueCount++;

    return await Venue.create({
        name: "Test Venue " + venueCount,
        address: "123 Fake Street",
        capacity: 100,
        owner: owner._id,
        ...overrides
    });
}

export async function createEvent(venue: Venue, owner: User, overrides = {}) {

    eventCount++;

    return await Event.create({
        title: "Test Event " + eventCount,
        startTime: Date.now(),
        venue,
        owner,
        ...overrides
    });
}

export async function createTicket(event: Event, overrides = {}) {
    ticketCount++;

    return await Ticket.create({
        scanCode: 123,
        isScanned: false,
        status: "available",
        price: "$1",
        event,
        ...overrides
    })
}