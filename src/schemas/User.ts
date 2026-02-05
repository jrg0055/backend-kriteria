// src/schemas/User.ts
import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    name?: string;
    email: string;
    password?: string;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        name: { type: String },
        email: { type: String, unique: true, required: true },
        password: { type: String },
    },
    { timestamps: true }
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
