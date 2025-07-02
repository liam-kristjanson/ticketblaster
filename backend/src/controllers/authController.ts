import { Request, Response } from "express";
import User from "../models/User";

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
        res.status(200).json(matchedUser);
    } else {
        res.status(401).json({error: "Invalid username or password."});
    }
}