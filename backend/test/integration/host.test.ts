import request from 'supertest';
import app from '../../src/app';
import { mockHostToken } from '../mocks';
import { configDotenv } from 'dotenv';
import * as DataFactory from "../DataFactory"
import User from '../../src/models/User';
import Venue from '../../src/models/Venue';
import Ticket from '../../src/models/Ticket';
import Event from '../../src/models/Event';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

configDotenv();

let goodHost : User;
let goodVenue : Venue;
let goodEvent : Event;
let goodTicket : Ticket;
let goodHostToken : string;

let evilHost : User;
let evilVenue: Venue;
let evilEvent : Event;
let evilTicket : Ticket;
let evilHostToken : string;

let testCustomer : User;
let customerToken : string;


beforeAll(async () => {
    goodHost = await DataFactory.createUser({role: "host"});
    goodVenue = await DataFactory.createVenue(goodHost);
    goodEvent = await DataFactory.createEvent(goodVenue, goodHost);
    goodTicket = await DataFactory.createTicket(goodEvent);

    evilHost = await DataFactory.createUser({role: "host"});
    evilVenue = await DataFactory.createVenue(evilHost);
    evilEvent = await DataFactory.createEvent(evilVenue, evilHost);
    evilTicket = await DataFactory.createTicket(evilEvent);

    testCustomer = await DataFactory.createUser({role: "customer"});

    goodHostToken = jwt.sign({
        id: goodHost.id,
        username: goodHost.username,
        role: goodHost.role
    },
    process.env.JWT_SECRET);

    evilHostToken = jwt.sign({
        id: evilHost.id,
        username: evilHost.username,
        role: evilHost.role
    },
    process.env.JWT_SECRET);

    customerToken = jwt.sign({
        id: testCustomer.id,
        username: testCustomer.username,
        role: testCustomer.role
    },
    process.env.JWT_SECRET);
})

describe('GET /host/tickets', () => {

    it('Responds to unauthenticated requests with status 401', async () => {
        return request(app).get('/host/tickets')
        .then(res => {
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error')
        })
    });

    it('Responds to query with missing eventId with status 400', async () => {
        return request(app).get('/host/tickets')
        .set('Authorization', mockHostToken)
        .then(res => {
            expect(res.status).toBe(400);
        })
    });

    it('Responds to query with invalid eventId with status 400', async () => {
        return request(app).get('/host/tickets')
        .set('Authorization', mockHostToken)
        .query({eventId: "aaaaaaaaa"})
        .then(res => {
            expect(res.status).toBe(400);
        })
    });

    it('Responds to authorized user with correct tickets on owned event', async () => {

        const res = await request(app).get('/host/tickets')
        .query({eventId: goodEvent.id})
        .set('Authorization', goodHostToken);

        expect(res.status).toBe(200);
        
        let ticketArray = res.body;

        let ticketIds = ticketArray.map((ticket: { _id: string; }) => {
            return ticket._id;
        })

        expect(ticketIds).toContain(goodTicket.id);
        expect(ticketIds).not.toContain(evilTicket.id);
    });

    it('Responds to authenticated user with status 401 on unowned event', async () => {

        const res = await request(app).get('/host/tickets')
        .query({eventId: goodEvent.id})
        .set('Authorization', evilHostToken);

        expect(res.status).toBe(401);
    })

    it('Responds to authenticated user with status 401 on non-existant event', async () => {
        
        const res = await request(app).get('/host/tickets')
        .query({eventId: new ObjectId().toString()})
        .set('Authorization', evilHostToken);

        expect(res.status).toBe(401);
    })

});

describe('POST /host/ticket/scan', () => {
    it('Responds to unauthenticated request with status 401', async () => {
        return request(app)
        .post("/host/ticket/scan")
        .then(res => {
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error');
        })
    });

    it('Responds to request with missing scanCode with status 400', async () => {
        return request(app)
        .post('/host/ticket/scan')
        .set('Authorization', mockHostToken)
        .then(res => {
            expect(res.status).toBe(400);
        })
    });

    it('Responds to non-existing ticket id with status 401', async () => {
        const fakeOid = new ObjectId().toString();

        const res = await request(app)
        .post('/host/ticket/scan')
        .query({scanCode: fakeOid})
        .set('Authorization', goodHostToken)

        expect(res.status).toBe(401);
    });

    it('Responds to ticket for wrong event with status 401', async () => {
        const res = await request(app)
        .post('/host/ticket/scan')
        .query({scanCode: evilTicket.id})
        .set('Authorization', goodHostToken);

        expect(res.status).toBe(401);
    });

    it('Responds to first ticket scan with status 200, and second scan with status 403', async () => {
        const scan1Res = await request(app)
        .post('/host/ticket/scan')
        .query({scanCode: goodTicket.id})
        .set('Authorization', goodHostToken);

        expect(scan1Res.status).toBe(200);

        const scan2Res = await request(app)
        .post('/host/ticket/scan')
        .query({scanCode: goodTicket.id})
        .set('Authorization', goodHostToken);

        expect(scan2Res.status).toBe(403);
    });
});

describe('POST /host/tickets', () => {
    it('Responds to unauthenticated requests with status 401', async () => {
        const res = await request(app)
        .post('/host/tickets');

        expect(res.status).toBe(401);
    });

    it('Responds to requests from customers with status 401', async () => {
        const res = await request(app)
        .post('/host/tickets')
        .set('Authorization', customerToken);

        expect(res.status).toBe(401);
    });

    it('Responds to requests with missing eventId with status 400', async () => {
        const missingIdResult = await request(app)
        .post('/host/tickets')
        .set('Authorization', goodHostToken);

        expect(missingIdResult.status).toBe(400);
    })

    it('Responds to requests with missing or invalid count parameter with status 400', async () => {
        const missingCountRequest = request(app)
        .post('/host/tickets')
        .set('Authorization', goodHostToken)
        .query({eventId: goodEvent.id});

        const invalidCountRequest = request(app)
        .post('/host/tickets')
        .set('Authorization', goodHostToken)
        .query({eventId: goodEvent.id, count: "abc123"})

        const [missingCountResult, invalidCountResult] = await Promise.all([missingCountRequest, invalidCountRequest]);

        expect(missingCountResult.status).toBe(400);
        expect(invalidCountResult.status).toBe(400);
    });

    it('Responds to requests with invalid or unowned eventId with status 400', async () => {

        const invalidIdRequest = request(app)
        .post('/host/tickets')
        .set('Authorization', goodHostToken)
        .query({eventId: "abc123", count:1});

        const fakeIdRequest = request(app)
        .post('/host/tickets')
        .set('Authorization', goodHostToken)
        .query({eventId: new ObjectId().toString(), count:1});

        const unownedIdRequest = request(app)
        .post('/host/tickets')
        .set('Authorization', evilHostToken)
        .query({eventId: goodEvent.id});

        const [invalidIdResult, fakeIdResult, unownedIdResult] = await Promise.all([invalidIdRequest, fakeIdRequest, unownedIdRequest]);

        expect(invalidIdResult.status).toBe(400);
        expect(fakeIdResult.status).toBe(400);
        expect(unownedIdResult.status).toBe(400);
    });

    it('Responds to valid request on create tickets for owned events with status 200', async () => {
        const res = await request(app)
        .post('/host/tickets')
        .set('Authorization', goodHostToken)
        .query({eventId: goodEvent.id, count: goodVenue.capacity});

        expect(res.status).toBe(200);
    })
})