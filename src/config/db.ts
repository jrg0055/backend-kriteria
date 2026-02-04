import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://KriterIA:HJARG@kriteria.fcfdqm6.mongodb.net/?appName=KriterIA";

export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function connectDB(): Promise<void> {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}