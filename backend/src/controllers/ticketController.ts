import { Request, Response } from "express";
import Ticket from "../models/Ticket";

export async function getTickets(req: Request, res: Response) {
    const tickets = await Ticket.find();

    res.json(tickets);
}

export async function scanTicket(req: Request, res: Response) {
    if (!req.query.scanCode) {
        res.status(400).json({error: "scanCode must be provided in query string."});
        return;
    }

    const matchedTicket = await Ticket.findOne({scanCode: req.query.scanCode}).exec();

    if (matchedTicket && !matchedTicket.isScanned) {
        matchedTicket.isScanned = true;

        await matchedTicket.save();

        res.status(200).json({message: "Ticket scanned successfuly."})
        return;
    } else if (!matchedTicket) {
        res.status(404).json({error: "Ticket with scan code " + req.query.scanCode + " does not exist.",});
        return;
    } else if (matchedTicket.isScanned) {
        res.status(403).json({error: "Ticket has already been scanned."});
        return;
    }
}