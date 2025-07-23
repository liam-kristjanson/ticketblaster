import { Request, Response } from "express";
import User from "../models/User";
import jwt from 'jsonwebtoken';
import { configDotenv } from "dotenv";
import { UserPayload } from "../types";

configDotenv();

export async function login(req: Request, res: Response) {

    if (!(req.body?.username && req.body?.password)) {
        res.status(400).json({error: "Malformed request body"});
        return;
    }

    const matchedUser = await User.findOne({username: req.body.username}).exec();

    if (!matchedUser) {
        res.status(401).json({error: "Invalid username or password."});
        return;
    }

    if (matchedUser.password === req.body.password) {

        let userPayload : UserPayload = {
            id: matchedUser.id,
            username: matchedUser.username,
            role: matchedUser.role,
            authToken : undefined
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        if (JWT_SECRET === undefined) {
            console.error("Unable to fetch JWT secret from environment");
            res.status(500).json({error: "500 : Internal Server Error."});
            return;
        } else {
            const userToken = jwt.sign(userPayload, process.env.JWT_SECRET ?? "");
            userPayload.authToken = userToken;
            res.status(200).json(userPayload);
        }
    } else {
        res.status(401).json({error: "Invalid username or password."});
    }
}