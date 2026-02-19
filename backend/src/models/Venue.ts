import mongoose, { Document, Schema, Types } from "mongoose";

interface Venue extends Document {
    name: string,
    address: string,
    capacity: number,
    owner: Types.ObjectId;
    image: string;
}

const venueSchema = new Schema<Venue>({
    name: {type: String, requred: true},
    address: {type: String, required: true},
    capacity: {type: Number, required: true},
    owner: {type: Schema.Types.ObjectId, required: true, ref: "User"},
    image: {type: String, required:false}
});

const Venue = mongoose.model<Venue>('Venue', venueSchema);

export default Venue;