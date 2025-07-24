import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

interface Event extends Document {
    title: string;
    eventLocation: string;
    startTime: Date;
    ownerId: ObjectId;
}

const eventSchema = new Schema<Event>({
    title: {type: String, required: true},
    eventLocation: {type: String, required: true},
    startTime: {type: Date, required: true},
    ownerId: {type: Schema.Types.ObjectId, required: true}
});

const Event = mongoose.model<Event>('Event', eventSchema)

export default Event;