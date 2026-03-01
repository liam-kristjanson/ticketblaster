import { configDotenv } from "dotenv";
import User from "../src/models/User";
import Venue from "../src/models/Venue";
import Event from "../src/models/Event"
import Ticket from "../src/models/Ticket";
import jwt from "jsonwebtoken"
import * as DataFactory from "./DataFactory"

configDotenv();

let goodHost : User;
let goodVenue : Venue;
let goodEvent : Event;
let goodTicket : Ticket;
let goodHostToken : string;

let goodCustomer : User;
let goodCustomerToken : string;

let evilCustomer : User;
let evilCustomerToken: string;

export async function seedTestData() {
    goodHost = await DataFactory.createUser({role: "host"});
    goodVenue = await DataFactory.createVenue(goodHost);
    goodEvent = await DataFactory.createEvent(goodVenue, goodHost);
    goodTicket = await DataFactory.createTicket(goodEvent);

    goodCustomer = await DataFactory.createUser({role: "customer"});
    evilCustomer = await DataFactory.createUser({role: "customer"});

    goodHostToken = jwt.sign({
        id: goodHost.id,
        username: goodHost.username,
        role: goodHost.role
    },
    process.env.JWT_SECRET);

    goodCustomerToken = jwt.sign({
        id: goodCustomer.id,
        username: goodCustomer.username,
        role: goodCustomer.role
    },
    process.env.JWT_SECRET);

    evilCustomerToken = jwt.sign({
        id: evilCustomer.id,
        username: evilCustomer.username,
        role: evilCustomer.role
    },
    process.env.JWT_SECRET);

    console.log("Data seeded!");
}

export {goodHost, goodVenue, goodEvent, goodTicket, goodHostToken, goodCustomer, goodCustomerToken, evilCustomer, evilCustomerToken}