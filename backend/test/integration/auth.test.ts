import { configDotenv } from "dotenv";
import request from "supertest";
import app from "../../src/app";
import User from "../../src/models/User";

configDotenv();

describe('POST /auth/login', () => {

    beforeAll(async () => {

        console.log("Creating users for auth testing...");

        const adminUser = new User({
            username: "admin",
            password: "AdminPassword123!",
            role: "admin"
        }).save();

        const customerUser = new User({
            username: "customer",
            password: "CustomerPassword123!",
            role: "customer"
        }).save();

        const hostUser = new User({
            username: "host",
            password: "HostPassword123!",
            role: "host"
        }).save();

        await Promise.all([adminUser, customerUser, hostUser]);
        console.log("Users created for auth testing successfuly.");
    })

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
    });

    it('Responds to valid username and invalid password with status 401', async () => {
        const res = await request(app).post('/auth/login')
        .send({
            username: "customer",
            password: "InvalidPassword",
        })

        expect(res.status).toBe(401);
    })

    it('Responds to invalid username and valid password with status 401', async () => {
        const res = await request(app).post('/auth/login')
        .send({
            username: "invalidUsername",
            password: "CustomerPassword123!"
        })

        expect(res.status).toBe(401);
    })

    it('Responds to valid login attempts with status 200 and authTokens', async () => {
        const customerLoginPromise = request(app).post('/auth/login')
        .send({
            username: "customer",
            password: "CustomerPassword123!",
        })

        const hostLoginPromise = request(app).post('/auth/login')
        .send({
            username: "host",
            password: "HostPassword123!",
        })

        const adminLoginPromise = request(app).post('/auth/login')
        .send({
            username: "admin",
            password: "AdminPassword123!"
        })

        const [customerRes, hostRes, adminRes] = await Promise.all([customerLoginPromise, hostLoginPromise, adminLoginPromise]);

        expect(customerRes.status).toBe(200);
        expect(customerRes.body.role).toBe("customer");
        expect(customerRes.body).toHaveProperty("authToken");

        expect(adminRes.status).toBe(200);
        expect(adminRes.body.role).toBe("admin");
        expect(adminRes.body).toHaveProperty("authToken");

        expect(hostRes.status).toBe(200);
        expect(hostRes.body.role).toBe("host");
        expect(hostRes.body).toHaveProperty("authToken");
    })
});