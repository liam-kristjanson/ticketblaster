import { Request, response, Response } from "express";
import Ticket from "../models/Ticket";
import Event from "../models/Event";
import { ObjectId } from "mongodb";
import * as z from 'zod';

export async function getAdminTickets(req: Request, res: Response) {

    const tickets = await Ticket.find().populate('event').exec();

    res.json(tickets);
}

export async function getHostTickets(req: Request, res: Response) {
    try {
        if (typeof req.query.eventId != 'string' || !ObjectId.isValid(req.query.eventId)) {
            res.status(400).json({error: "Missing or invalid eventId"});
            return;
        }

        const matchedEvent = await Event.findById(req.query.eventId);

        if (matchedEvent?.owner.toString() !== req.user.id) {
            console.log("Rejected host tickets request due to mismatched user id and event owner id");
            res.status(401).json({error: "401: Unauthorized"});
            return;
        }

        const matchedTickets = await Ticket.find({event: req.query.eventId});

        res.json(matchedTickets);

    } catch (err) {
        console.error("The following error occured while fetching host tickets:", err);
        res.status(500).json({error: "An error occured while fetching host tickets"});
    }
}

export async function getCustomerTickets(req: Request, res: Response) {
    //validate event id
    if (typeof req.query.eventId != 'string') {
        res.status(400).json({error: "eventId must be a string defined in querystring"});
        return;
    }

    if (!ObjectId.isValid(req.query.eventId)) {
        res.status(400).json({error: "Invalid eventId"});
        return;
    }

    const matchedTickets = await Ticket.find({event: req.query.eventId, status: "available"}).populate('event').exec();

    res.status(200).json(matchedTickets);
}

export async function scanTicket(req: Request, res: Response) {
    if (!req.query.scanCode) {
        res.status(400).json({error: "scanCode must be provided in query string."});
        return;
    }

    const matchedTicket = await Ticket.findOne({_id: req.query.scanCode}).exec();

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
    try {
        if (!req.user || !['admin', 'host'].includes(req.user.role)) {
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

        let ticketsToCreate : Ticket[] = [];

        for (let i = 0; i<parseInt(req.query.count); i++) {
            ticketsToCreate.push(new Ticket({
                scanCode: "1",
                event: req.query.eventId,
                isScanned: false,
                status: "available",
                price: "$1",
            }));
        }

        const result = await Ticket.insertMany(ticketsToCreate);

        res.status(200).json({message: "All tickets created successfuly"});
    } catch (err) {
        console.error("The following error occured while creating tickets:", err);
        res.status(500).json({error: "An error occured while creating tickets"});
        return;
    }
}

export async function purchaseTicket(req: Request, res: Response) {

    if (!req.user?.id) {
        res.status(401).json({error: "401: Unauthorized"});
        return;
    }

    const PurchaseValidation = z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.email(),
        phone: z.string(),

        cardName: z.string(),
        cardNumber: z.string(),
        expiry: z.string(),

        ticketId: z.string()
    });

    const validationResult = PurchaseValidation.safeParse(req.body);

    if (!validationResult.success) {
        console.log(validationResult.error.issues);
        res.status(400).json({error: "Malformed request body"});
        return;
    }

    const purchaseRequest = validationResult.data;

    if (!ObjectId.isValid(purchaseRequest.ticketId)) {
        res.status(400).json({error: "Invalid ticketId"});
        return;
    }

    const matchedTicket = await Ticket.findById(purchaseRequest.ticketId);

    if (!matchedTicket) {
        res.status(404).json({error: "Requested ticket not found"});
        return;
    }

    if (matchedTicket.status == "sold") {
        res.status(400).json({error: "Requested ticket has been sold"});
        return;
    }

    matchedTicket.status = "sold"
    matchedTicket.owner = req.user.id;

    await matchedTicket.save();

    res.status(200).json({message: "Ticket purchased successfuly"});
}

export async function getMyTickets(req: Request, res: Response) {
    if (!req.user?.id) {
        res.status(401).json({error: "401: Unauthorized"});
    }

    const matchedTickets = await Ticket.find({owner: req.user.id}).populate('event').exec();

    res.status(200).json(matchedTickets);
}