import mongoose, { Schema } from "mongoose";
import { TicketStatus } from "../types";

interface Ticket extends Document {
    scanCode: string;
    isScanned: boolean;
    eventId: string;
    status: TicketStatus;
    ownerId: string;
}

const ticketSchema = new Schema<Ticket>({
    scanCode: {type: String, required: true},
    isScanned: {type: Boolean, required: true},
    eventId: {type: String, required: true},
    status: {type: String, enum: ["available", "sold", "hold"], required: true},
    ownerId: {type: String, required: false}    
});

const Ticket = mongoose.model<Ticket>('Ticket', ticketSchema);

export default Ticket;