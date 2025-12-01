// src/db.ts

import mongoose from 'mongoose';


// It should look something like: 'mongodb://localhost:27017/mydatabase'
// or 'mongodb+srv://user:password@clustername/mydatabase?retryWrites=true&w=majority'


export const connectDB = async (): Promise<void> => {
    // Put this MongoUri variable inside the function because all the env variables is needed to load first in Server.ts file(dotenv.config())
    // Then call this connectDB function
    const MONGO_URI: string = process.env.MONGO_URI || '';
    if (!MONGO_URI) {
        console.error("❌ ERROR: MONGO_URI environment variable is not set.");
        process.exit(1);
    }

    try {
        // Mongoose automatically handles connection pooling and retries.
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected successfully!");

    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        // Exit complete process with failure code: 0 for success(Default) and 1 for failure
        process.exit(1); 
    }
};

