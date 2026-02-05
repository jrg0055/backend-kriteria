import { Schema, model } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt?: Date;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'basic'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model<IUser>("User", userSchema);
