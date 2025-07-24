import { Request, Response } from "express"
import Event from "../models/Event";
import { ObjectId } from "mongodb";

export async function createEvent(req: Request, res: Response) {

    if (!req.user) {
        res.status(400).json({error: "400: Unauthorized"});
    }

    if (!req.body) {
        res.status(400).json({error: "Missing request body"});
        return;
    }

    if (!req.body.title || !req.body.eventLocation || !req.body.startTime) {
        res.status(400).json({error: "Malformed request body"});
        return;
    }

    let title = req.body.title;
    let eventLocation = req.body.eventLocation
    let startTime = new Date(req.body.startTime);
    let ownerId = new ObjectId(req.user.id);

    if (isNaN(startTime.getTime())) {
        res.status(400).json({error: "Invalid date format for startDate"});
        return;
    }

    const newEvent = new Event({title, eventLocation, startTime, ownerId})
    await newEvent.save();

    res.status(200).json({message: "Event created successfuly"});
}

export async function getEvents(req: Request, res: Response) {
    const events = await Event.find();

    res.json(events);
}

export async function deleteEvent(req: Request, res: Response) {
    if (req.user?.role === "admin") {

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

    } else {
        res.status(401).json({error: "400: Unauthorized"});
    }
}