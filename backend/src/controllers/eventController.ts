import { Request, Response } from "express"
import Event from "../models/Event";

export async function createEvent(req: Request, res: Response) {

    if (!req.body) {
        res.status(401).json({error: "Missing request body"});
        return;
    }

    if (!req.body.title || !req.body.eventLocation || !req.body.startTime) {
        res.status(401).json({error: "Malformed request body"});
        return;
    }

    let title = req.body.title;
    let eventLocation = req.body.eventLocation
    let startTime = new Date(req.body.startDate);

    if (isNaN(startTime.getTime())) {
        res.status(401).json({error: "Invalid date format for startDate"});
        return;
    }

    const newEvent = new Event({title, eventLocation, startTime})
    await newEvent.save();

    res.status(200).json({message: "Event created successfuly"});
}

export async function getEvents(req: Request, res: Response) {
    const events = await Event.find();

    res.json(events);
}