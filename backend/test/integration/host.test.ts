import request from 'supertest';
import app from '../../src/app';
import { mockHostToken } from '../mocks';
import { configDotenv } from 'dotenv';

configDotenv();


describe('GET /host/tickets', () => {
    it('Responds to unauthorized users with status 401', async () => {
        const res = await request(app).get('/host/tickets');

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error')
    });

    it('Responds to query with missing eventId with status 400', async () => {
        const res = await request(app).get('/host/tickets')
        .set('Authorization', mockHostToken)

        expect(res.status).toBe(400);
    });

    it('Responds to query with invalid eventId with status 400', async () => {
        const res = await request(app).get('/host/tickets')
        .set('Authorization', mockHostToken)
        .query({eventId: "aaaaaaaaa"});

        expect(res.status).toBe(400);
    });
});

describe('POST /host/ticket/scan', () => {
    it('Responds to unauthenticated request with status 401', async () => {
        const res = await request(app)
        .post("/host/ticket/scan");

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe("401: Unauthorized");
    });

    it('Responds to request with missing scanCode with status 400', async () => {
        const res = await request(app)
        .post('/host/ticket/scan')
        .set('Authorization', mockHostToken);

        expect(res.status).toBe(400);
    })
})