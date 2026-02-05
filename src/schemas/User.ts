import { Schema, model } from "mongoose";

interface IUser {
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

export default model<IUser>("User", userSchema);
