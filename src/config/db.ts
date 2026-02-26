import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || "mongodb+srv://KriterIA:HJARG@kriteria.fcfdqm6.mongodb.net/?appName=KriterIA";

export async function connectDB(): Promise<void> {
    try {
        if (mongoose.connection.readyState === 1) {
            // Already connected
            return;
        }
        await mongoose.connect(uri, { dbName: "Modelos" });
        console.log("Connected to MongoDB via Mongoose!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}