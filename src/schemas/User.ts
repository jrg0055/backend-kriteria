import { Schema, model } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password?: string; // Opcional para soportar Google Auth
    googleId?: string; // Para vincular la cuenta de Google
    role: 'basic' | 'premium';
    createdAt?: Date;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    googleId: { type: String, required: false },
    role: { type: String, default: 'basic' },
    createdAt: { type: Date, default: Date.now }
});

export default model<IUser>("User", userSchema);