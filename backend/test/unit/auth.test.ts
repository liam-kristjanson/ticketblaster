import { configDotenv } from "dotenv";
import request from "supertest";
import app from "../../src/app";

configDotenv();

describe('POST /auth/login', () => {
    it('Responds to requests without body with status 400', async () => {
        return request(app).post('/auth/login')
        .then(res => {
            expect(res.status).toBe(400);
        })
    });

    it('Responds to requests without username with status 400', async () => {
        return request(app).post('/auth/login')
        .send({
            password: "abc123"
        })
        .then(res => {
            expect(res.status).toBe(400);
        })
    });

    it('Responds to requests without password with status 400', async () => {
        return request(app).post('/auth/login')
        .send({
            username: "abc123"
        })
        .then(res => {
            expect(res.status).toBe(400);
        })
    })
});