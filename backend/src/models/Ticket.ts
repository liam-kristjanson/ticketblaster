import mongoose, { Schema } from "mongoose";

interface Ticket extends Document {
    scanCode: string;
    isScanned: boolean;
}

const ticketSchema = new Schema<Ticket>({
    scanCode: {type: String, required: true},
    isScanned: {type: Boolean, required: true}
});

const Ticket = mongoose.model<Ticket>('Ticket', ticketSchema);

export default Ticket;