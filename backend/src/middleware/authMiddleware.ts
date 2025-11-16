import { configDotenv } from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import z from "zod"; 

configDotenv();

export async function verifyAuthToken(req: Request, res: Response, next: NextFunction) {

    //zod schema
    const User = z.object({
        username: z.string(),
        role: z.enum(['admin', 'customer', 'host']),
        id: z.string()
    })

    if (!process.env.JWT_SECRET) {
        console.error("Failed to fetch JWT secret from environment");
        res.status(500).json({error: "500 : Internal server error"});
        return;
    }

    if (req.headers.authorization) {
        console.log("Authorization header: ", req.headers.authorization);

        req.user = User.parse(jwt.verify(req.headers.authorization, process.env.JWT_SECRET));

        console.log("Parsed user data: ", req.user);
    }

    next()
}

export function verifyAdminStatus(req: Request, res: Response, next: NextFunction) {
    if (req.user?.role === "admin") {
        next();
        return;
    } else {
        res.status(401).json({error: "401: Unauthorized"});
        return;
    }
}