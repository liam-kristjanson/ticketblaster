import request from 'supertest';
import app from '../src/app';

describe('GET /host/tickets', () => {
    it('Responds to unauthorized users with status 500', async () => {
        const res = await request(app).get('/host/tickets');

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error')
    });
});