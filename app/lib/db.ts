import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define mongodb in .env")

}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
        }
        cached.promise = mongoose.connect(MONGODB_URI!, opts).then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise
    }
    catch (error) {
        cached.promise = null
        throw error
    }
    return cached.conn
}
