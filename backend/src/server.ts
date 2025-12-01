import express, { type Request, type Response } from 'express';
import * as dotenv from 'dotenv';
import { connectDB } from './config/db.ts';


// Load environment variables from .env file (if you use a .env file)
dotenv.config();

// Get the port from environment variables (like PORT=8080) or default to 3000
const PORT = process.env.PORT || 3000;

// Initialize the Express application instance
const app = express();

// --- Middleware Setup ---
// Middleware to parse incoming JSON request bodies
app.use(express.json());



// --- Routes ---
// Basic GET route handler for the root path
app.get('/', (req: Request, res: Response) => {
    // We explicitly use Request and Response types from 'express' for strong typing
    res.status(200).json({
        message: 'Hello World from a TypeScript Node Backend!',
        status: 'online',
        serverTime: new Date().toISOString()
    });
});

// ---Database Connection ---
connectDB();

// --- Server Initialization ---
// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(` Server is running at http://localhost:${PORT}`);
});
