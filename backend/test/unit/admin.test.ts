import request from 'supertest';
import app from '../../src/app';
import { mockCustomerToken, mockHostToken } from '../mocks';

describe('Admin authorization middleware', () => {
    it('Responds to requests without auth token with status 401', async () => {

        return request(app).get('/admin/')
        .then(res => {
            expect(res.status).toBe(401);
        })
    })

    it('Responds to invalid jwt in authorization header with status 401', async () => {

        return request(app).get('/admin/')
        .set('Authorization', 'abcdefg12345')
        .then(res => {
            expect(res.status).toBe(401);
        })
    })

    it('Responds to requests with customer authorization tokens with status 401', async () => {
        return request(app).get('/admin/')
        .set('Authorization', mockCustomerToken)
        .then(res => {
            expect(res.status).toBe(401);
        })
    })

    it('Responds to requests with host authorization tokens with status 401', async () => {
        return request(app).get('/admin/')
        .set('Authorization', mockHostToken)
        .then(res => {
            expect(res.status).toBe(401);
        })
    })
})


describe('GET /admin/tickets', () => {
    it('Responds to requests without auth token with status 401', async () => {
        const res = await request(app).get('/admin/tickets');

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
    });

    it('Responds to host and customer users with status 401', async () => {
        const hostRes = await request(app).get('/admin/tickets')
        .set('Authorization', mockHostToken);

        expect(hostRes.status).toBe(401);
        expect(hostRes.body).toHaveProperty('error');


        const customerRes = await request(app).get('/admin/tickets')
        .set('Authorization', mockCustomerToken);

        expect(customerRes.status).toBe(401);
        expect(customerRes.body).toHaveProperty('error');
    });
})