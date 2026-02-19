import { Request, Response } from "express";
import Venue from "../models/Venue";
import { ObjectId } from "mongodb";
import User from "../models/User";
import busboy from "busboy";

export async function getMyVenues(req: Request, res: Response) {

    const venues = await Venue.find({owner: req.user.id});

    res.json(venues);
}

export async function createVenue(req: Request, res: Response) {

    let newVenue : Venue;

    if (!req.body) {
        res.status(400).json({error: "Missing request body"});
        return;
    }

    try {
        newVenue = new Venue({
            name: req.body.name,
            address: req.body.address,
            capacity: req.body.capacity,
            owner: req.user?.id
        })

        await newVenue.save();
        res.json({message: "New venue saved successfuly"});

    } catch (err) {
        console.error("Error saving new venue: ", err);

        if (err.name == 'ValidationError') {
            res.status(400).json({error: "Malformed request body."});
            return;
        }

        res.status(500).json({error: "An error occured while saving the venue."});
    }

}

export async function adminDeleteVenue(req: Request, res: Response) {

    try {
        const result = await Venue.deleteOne({_id: req.query.id}).exec();
        res.json({message: "Deleted " + result.deletedCount + " venue(s)"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "An error occured while deleting venue"});
    }
}

export async function hostDeleteVenue(req: Request, res: Response) {
    try {
        
        if (!req.query.id || typeof req.query.id != 'string' || !ObjectId.isValid(req.query.id)) {
            res.status(400).json({error: "Invalid venue id."});
            return;
        }

        const matchedVenue = await Venue.findById(req.query.id).exec();

        if (!matchedVenue) {
            res.status(404).json({error: "Venue with requested id not found"});
            return;
        }

        if (matchedVenue.owner.toString() === req.user?.id) {
            await matchedVenue.deleteOne();
            res.json({message: "Venue deleted successfuly"});
        } else {
            res.status(401).json({error: "401: Unauthorized"});
        }

    
    } catch (err) {
        console.error("The following error occured while deleting venue with id " + req.query.venue, err);
        res.status(500).json({error: "An error occured while deleting venue."});
    }
}

export async function hostUpdateVenue(req: Request, res: Response) {

    if (!req.query.id || typeof req.query.id != "string" || !ObjectId.isValid(req.query.id)) {
        res.status(400).json({error: "Invalid venue id."});
        return;
    }

    const matchedVenue = await Venue.findById(req.query.id).populate<{owner: User}>('owner');

    if (!matchedVenue || matchedVenue.owner.id !== req.user?.id) {
        res.status(400).json({error: "Invalid venue id."});
        return;
    }

    const bb = busboy({headers: req.headers});

    bb.on('file', (name, fileStream, info) => {
        const {filename, encoding, mimeType} = info;       

        console.log(
        `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
        filename,
        encoding,
        mimeType
      );

      const fileExtension = "." + filename.split('.').pop();

      console.log("Uploading file to storage...");
      fetch(process.env.STORAGE_CONNECTION_STRING + "/upload", {
        method: "POST",
        headers: {
            "Content-Type": mimeType,
            "Ticketblaster-Filename": "venue" + matchedVenue.id + fileExtension
        },
        duplex: 'half',
        body: fileStream
      } as any) //bypass type check to allow file stream and duplex to be defined in the fetch.
      .then(fileUploadResponse => {
        fileUploadResponse.json().then(responseJson => {
            if (fileUploadResponse.ok) {
                res.json({message: "File uploaded"});
                console.log("File uploaded");
                return;
            } else {
                res.status(500).json({error: "500: An error occured while uploading file"});
                console.error("An error occured while uploading file")
                return;
            }
        })
        .catch(err => {
            res.status(500).json({error: "500: An unexpected error occured while uploading file"});
        })
      })
    })

    //TODO: Use these to update the text fields of the venue
    bb.on('field', (name, val, info) => {
      console.log(`Field [${name}]: value: %j`, val);
    });

    bb.on('close', () => {
      console.log('Done parsing form!');
      res.writeHead(303, { Connection: 'close', Location: '/' });
      res.end();
    });

    req.pipe(bb);
}