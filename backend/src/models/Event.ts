import mongoose, { Schema } from "mongoose";

interface Event extends Document {
    title: string;
    eventLocation: string;
    startTime: Date;
}

const eventSchema = new Schema<Event>({
    title: {type: String, required: true},
    eventLocation: {type: String, required: true},
    startTime: {type: Date, required: true}
});

const Event = mongoose.model<Event>('Event', eventSchema)

export default Event;