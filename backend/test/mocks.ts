import { configDotenv } from "dotenv";
import { User } from "../src/types";
import jwt from 'jsonwebtoken';

configDotenv();

const adminPayload : User = {
    id: "68658e4364ad644c6f8bba34",
    username: "mockAdmin",
    role: "host"
}

const customerPayload : User = {
    id: "68658e4364ad644c6f8bba34",
    username: "mockCustomer",
    role: "customer"
}

const hostPayload = {
    id: "68658e4364ad644c6f8bba34",
    username: "mockHost",
    role: "host"
}

export const mockAdminToken = jwt.sign(adminPayload, process.env.JWT_SECRET);
export const mockCustomerToken = jwt.sign(customerPayload, process.env.JWT_SECRET);
export const mockHostToken = jwt.sign(hostPayload, process.env.JWT_SECRET);