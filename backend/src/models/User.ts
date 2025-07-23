import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "../types";

interface User extends Document {
    username: string,
    password: string,
    role: UserRole
}

const userSchema = new Schema<User>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, enum:['customer', 'admin'], required: true}
});

const User = mongoose.model<User>('User', userSchema);

export default User;