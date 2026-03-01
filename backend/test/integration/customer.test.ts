import * as DataFactory from "../DataFactory"
import request from "supertest"
import app from "../../src/app";
import { ObjectId } from "mongodb";
import { evilCustomerToken, goodCustomerToken, goodEvent, seedTestData } from "../TestData";
import Ticket from "../../src/models/Ticket";

beforeAll(async () => {
    await seedTestData();
})

describe("GET /customer/hold-ticket", () => {

    const route = "/customer/hold-ticket"

    it('Responds to unauthenticated request with status 401', async () => {
        const res = await request(app)
        .get(route)

        expect(res.status).toBe(401);
    });

    it('Responds to request with missing id parameter with status 400', async () => {
        const res = await request(app)
        .get(route)
        .set('authorization', evilCustomerToken)

        expect(res.status).toBe(400);
    })

    it('Responds to request with invalid id parameter with status 400', async () => {
        const res = await request(app)
        .get(route)
        .set('authorization', evilCustomerToken)
        .query({id: "abc123"});

        expect(res.status).toBe(400);
    })

    it('Respond to request for non-existing ticket with status 404', async () => {

        const fakeOid = new ObjectId();

        const res = await request(app)
        .get(route)
        .set('authorization', evilCustomerToken)
        .query({id: fakeOid.toString()});

        expect(res.status).toBe(404);
    })

    it('Responds to second request to hold same ticket with status 403', async () => {
        const ticketToHold = await DataFactory.createTicket(goodEvent);

        const firstRes = await request(app)
        .get(route)
        .set('authorization', goodCustomerToken)
        .query({id: ticketToHold.id});

        expect(firstRes.status).toBe(200);

        const secondRes = await request(app)
        .get(route)
        .set('authorization', evilCustomerToken)
        .query({id: ticketToHold.id});

        expect(secondRes.status).toBe(403);
    })

    it('Responds to authorized request with status 200, and sets ticket status to hold', async () => {
        const ticketToHold = await DataFactory.createTicket(goodEvent);

        const firstRes = await request(app)
        .get(route)
        .set('authorization', goodCustomerToken)
        .query({id: ticketToHold.id});

        expect(firstRes.status).toBe(200);

        const resultingTicket = await Ticket.findById(ticketToHold.id);

        expect(resultingTicket.status).toBe("hold");
    })
})