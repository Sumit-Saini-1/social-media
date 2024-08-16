import mongoose from "mongoose";
const DATABASE_URL: string = process.env.DATABASE_URL||"";

interface IConnection {
    isConnected?: number;
}
const connection: IConnection = {};

async function dbConnect() {
    if (connection.isConnected) {
        return;
    }
    const db = await mongoose.connect(DATABASE_URL);
    console.log("MongoDB connected");
    connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;