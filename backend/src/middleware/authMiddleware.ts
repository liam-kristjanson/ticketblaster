import { configDotenv } from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import z from "zod"; 
import { ObjectId } from "mongodb";

configDotenv();


//zod schema to verify structure of token payload
const User = z.object({
        username: z.string(),
        role: z.enum(['admin', 'customer', 'host']),
        id: z.string()
    })

export async function verifyAuthToken(req: Request, res: Response, next: NextFunction) {

    //if no auth token presented, reject the request immediately
    if (!req.headers.authorization) {
        res.status(401).json({error: "401: Unauthorized"});
        return;
    }
    

    if (!process.env.JWT_SECRET) {
        console.error("Failed to fetch JWT secret from environment");
        res.status(500).json({error: "500 : Internal server error"});
        return;
    }

        console.log("Authorization header: ", req.headers.authorization);

        try {
            const tokenData = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

            const tokenParseResult = User.safeParse(tokenData);

            if (tokenParseResult.success && ObjectId.isValid(tokenParseResult.data.id)) {
                req.user = tokenParseResult.data;
                console.log("Parsed user data: ", req.user);
                next();
            } else {
                res.status(401).json({error: "401: Unauthorized"});
            }
        } catch (err) {
            console.error("Encountered the following error while parsing authorization token:", err)
            res.status(401).json({error: "401: Unauthorized"});
        }
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

export function verifyHostStatus(req: Request, res: Response, next: NextFunction) {
    if (req.user?.role === "host") {
        next();
        return;
    } else {
        res.status(401).json({error: "401: Unauthorized"});
        return;
    }
}