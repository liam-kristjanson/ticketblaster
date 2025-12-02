import { Request, Response } from "express"
import Event from "../models/Event";
import { ObjectId } from "mongodb";
import Ticket from "../models/Ticket";

export async function createEvent(req: Request, res: Response) {

    if (!['admin', 'host'].includes(req.user?.role)) {
        res.status(401).json({error: "401: Unauthorized"});
    }

    if (!req.body) {
        res.status(400).json({error: "Missing request body"});
        return;
    }

    if (!req.body.title || !req.body.venue || !req.body.startTime) {
        res.status(400).json({error: "Malformed request body"});
        return;
    }

    try {

        let title = req.body.title;
        let venue = req.body.venue
        let startTime = new Date(req.body.startTime);
        let owner = new ObjectId(req.user.id);

        if (isNaN(startTime.getTime())) {
            res.status(400).json({error: "Invalid date format for startDate"});
            return;
        }

        const newEvent = new Event({title, venue, startTime, owner})
        await newEvent.save();
        res.status(200).json({message: "Event created successfuly"});
        return;
    } catch (err) {
        console.error("The following error occured while saving new event to database:", err);
        console.error("The error occured with the following request body: ", JSON.stringify(req.body));
        res.status(400).json({error: "An error occured while saving the event."});
        return;
    }
}

export async function getEvents(req: Request, res: Response) {
    const events = await Event.find();

    res.json(events);
}

export async function deleteEvent(req: Request, res: Response) {
    if (req.user?.role === "admin") {
        adminDeleteEvent(req, res);
    } else if (req.user?.role === "host") {
        hostDeleteEvent(req, res);
    } else {
        res.status(401).json({error: "400: Unauthorized"});
    }
}

async function adminDeleteEvent(req: Request, res: Response) {
    if (!req.query.eventId) {
        res.status(400).json({error: "eventId must be specified in querystring."});
        return;
    }

    const result = await Event.deleteOne({_id: req.query.eventId}).exec();

    if (result.deletedCount === 0) {
        res.status(404).json({error: "Event with given eventId not found"});
        return;
    }

    res.status(200).json({message: "Event deleted successfuly"});
}

async function hostDeleteEvent(req: Request, res: Response) {
    if (!("string" === typeof req.query?.eventId)) {
        res.status(400).json({error: "eventId must be specified in querystring."});
    }

    try {
        const matchedEvent = await Event.findById(req.query.eventId);

        if (!matchedEvent || req.user?.id != matchedEvent.owner.toString()) {
            res.status(404).json({error: "invalid eventId"});
            return;
        }

        console.log("Deleting tickets for event with id" + req.query.eventId);
        const ticketDeletionResult = await Ticket.deleteMany({event: matchedEvent._id});
        console.log("Deleted " + ticketDeletionResult.deletedCount + " ticket(s).");

        console.log("Deleting event document with id " + matchedEvent._id);
        const eventDeleteResult = await matchedEvent.deleteOne();
        console.log("Deleted " + eventDeleteResult.deletedCount + " event(s).");

        res.json({message: "Event deleted successfuly."})
    } catch (err) {
        console.error("The following error occured while deleting event with id " + req.query.eventId, err);
    }
}

export async function getMyEvents(req: Request, res: Response) {
    switch (req.user?.role) {
        case "host":
            res.json(await Event.find({owner: req.user.id}).populate('venue').exec());
            return;
        default:
            res.status(401).json({error: "401: Unauthorized"});
            return;
    }
}