import mongoose, { Schema, Document, Types } from "mongoose";
import { TicketStatus } from "../types";
import Event from "./Event";

interface Ticket extends Document {
    scanCode: string;
    isScanned: boolean;
    event: Types.ObjectId;
    status: TicketStatus;
    owner: Types.ObjectId;
    price: string;
    purchaseTime: Date;
}

const ticketSchema = new Schema<Ticket>({
    scanCode: {type: String, required: true},
    isScanned: {type: Boolean, required: true},
    event: {type: Schema.Types.ObjectId, required: true, ref: 'Event'},
    status: {type: String, enum: ["available", "sold", "hold"], required: true},
    owner: {type: Schema.Types.ObjectId, required: false, ref: 'User'},
    price: {type: String, required: false},
    purchaseTime: {type: Date, required: false}
});

const Ticket = mongoose.model<Ticket>('Ticket', ticketSchema);

export default Ticket;