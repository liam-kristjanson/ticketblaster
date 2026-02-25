import { Request, response, Response } from "express";
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

//TODO: split this into one route to update text fields, another for image.
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
    let fileUploadPromise: Promise<globalThis.Response>;
    let isFileSubmitted = false;

    bb.on('file', (name, fileStream, info) => {

        const {filename, encoding, mimeType} = info;      

        console.log(
        `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
        filename,
        encoding,
        mimeType
      );

      if (!filename) {
        console.log("Detected file submitted without filename. Resuming stream.");
        fileStream.resume()
        return;
      }

      const fileExtension = "." + filename.split('.').pop();

      if (![".png", ".jpg", ".jpeg"].includes(fileExtension)) {
        console.log("Invalid extension detected for file. Recieved " + fileExtension + " rejecting request." );
        res.status(400).json({error: "Invalid filetype. Please submit a file in .png, .jpg, or .jpeg"});
        res.end();
        return;
      }

      console.log("Uploading file to storage...");

      fileUploadPromise = fetch(process.env.STORAGE_CONNECTION_STRING + "/upload", {
        method: "POST",
        headers: {
            "Content-Type": mimeType,
            "Ticketblaster-Filename": "venue" + matchedVenue.id + fileExtension
        },
        duplex: 'half',
        body: fileStream
      } as any) //bypass type check to allow file stream and duplex to be defined in the fetch.

      isFileSubmitted = true;
    })

    bb.on('field', (name, val, info) => {
        console.log(`Field [${name}]: value: %j`, val);

        //map fields onto matched venue document.
        switch (name) {
            case "capacity":
                if (!isNaN(parseInt(val))) {
                    matchedVenue.capacity = parseInt(val);
                }
                break;
            case "name":
                matchedVenue.name = val;
                break;
            case "address":
                matchedVenue.address = val;
                break;
        }
    });

    bb.on('close', async () => {
      console.log('Done parsing form!');
      //res.writeHead(303, { Connection: 'close', Location: '/' });
      //res.end();

      try {
        if (isFileSubmitted) {
            let fileUploadResponse = await fileUploadPromise;

            if (fileUploadResponse.ok) {
                let fileUploadJson = await fileUploadResponse.json();
                console.log("Recieved OK response from storage service: ", fileUploadJson);
                
                if (fileUploadJson.fileName) {
                    matchedVenue.image = fileUploadJson.fileName;
                    await matchedVenue.save();
                    res.status(200).json({message: "Venue updated successfuly.", venue: matchedVenue});
                } else {
                    throw new Error("Did not recieve filename from storage service despite OK response.");
                }
            } else {
                throw new Error("Recieved non-OK response from storage service in response to venue image upload");
            }
        } else {
            await matchedVenue.save();
            res.status(200).json({message: "Venue updated successfuly.", venue: matchedVenue})
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({error: "500: Internal server error"});
      }
    });

    bb.on('error', (err) => {
        console.error(err);
        res.status(500).json({error: "500: Internal server error (bb)"});
    })

    req.pipe(bb);
}