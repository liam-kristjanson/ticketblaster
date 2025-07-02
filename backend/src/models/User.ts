import mongoose, { Document, Schema } from "mongoose";

interface User extends Document {
    username: string,
    password: string,
    role: string
}

const userSchema = new Schema<User>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true}
});

const User = mongoose.model<User>('User', userSchema);

export default User;