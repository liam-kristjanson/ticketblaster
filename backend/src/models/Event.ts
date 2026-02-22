import { ObjectId } from "mongodb";
import mongoose, { Document, Schema } from "mongoose";

interface Event extends Document {
    title: string;
    startTime: Date;
    owner: ObjectId;
    venue: ObjectId;
    image?: string;
}

const eventSchema = new Schema<Event>({
    title: {type: String, required: true},
    startTime: {type: Date, required: true},
    venue: {type: Schema.Types.ObjectId, required: true, ref:"Venue"},
    owner: {type: Schema.Types.ObjectId, required: true, ref:"User"},
    image: {type: String, required: false}
});

const Event = mongoose.model<Event>('Event', eventSchema)

export default Event;