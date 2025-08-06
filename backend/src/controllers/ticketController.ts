import { Request, Response } from "express";
import Ticket from "../models/Ticket";
import Event from "../models/Event";
import { ObjectId } from "mongodb";

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

export async function createTicket(req: Request, res: Response) {
    console.log(req.body);

    if (!req.body) {
        res.status(400).json({error: "Missing request body"})
        return;
    }

    if (!req.body?.scanCode) {
        res.status(400).json({error: "Scan code must be included in request body"});
        return;
    }

    if (!req.body?.eventId) {
        res.status(400).json({error: "eventId must be included in request body"});
    }

    const newTicket = new Ticket({scanCode: req.body.scanCode, isScanned: false, eventId: req.body.eventId});
    await newTicket.save();

    res.status(200).json({message: "Ticket created successfuly", ticket: newTicket});
}

export async function deleteTicket(req: Request, res: Response) {

    if (!req.user || req.user.role !== "admin") {
        res.status(401).json({error: "401: Unauthorized"});
        return;
    }

    if (!req.query.ticketId) {
        res.status(400).json({error: "ticketId must be specified in querystring"});
        return;
    }

    const result = await Ticket.deleteOne({_id: req.query.ticketId}).exec();

    if (result.deletedCount >= 1) {
        res.status(200).json({message: "Ticket deleted successfuly"});
    } else {
        res.status(404).json({error: "Ticket with specified id not found"});
    }
}

export async function createEventTickets(req: Request, res: Response) {
    if (!req.user || req.user.role != "admin") {
        res.status(401).json({error: "401 : Unauthorized"});
        return;
    }

    if (!req.query.eventId || typeof(req.query.eventId) != 'string') {
        res.status(400).json({error: "eventId must be a string specified in querystring"});
        return;
    }

    if (typeof(req.query.count) != 'string' || isNaN(parseInt(req.query.count))) {
        res.status(400).json({error: "eventId must be a number specified in querystring"});
        return;
    }

    const matchedEvent = await Event.findById(req.query.eventId).exec();

    if (!matchedEvent) {
        res.status(404).json({error: "Event with specified id not found."});
        return;
    }

    let ticketPromiseArr = []

    for (let i = 0; i<parseInt(req.query.count); i++) {
        let newTicket = new Ticket({scanCode: 123, eventId: new ObjectId(req.query.eventId), isScanned: false})

        ticketPromiseArr.push(newTicket.save());
    }

    const allTicketsCreated = await Promise.all(ticketPromiseArr);

    res.status(200).json({message: "All tickets created successfuly"});
}