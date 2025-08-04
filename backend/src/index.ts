import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { logger } from "./utils/logger";
import { connectDB } from './utils/db';
import { serve } from "inngest/express";
import { inngest } from "./inngest";
import { functions as inngestFunctions } from "./inngest";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set up the "/api/inngest" routes
app.use("/api/inngest", serve({ client: inngest, functions : inngestFunctions }));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// Start the server
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            logger.info(`Server is running on http://localhost:${PORT}`);
            logger.info(`Inngest endpoint is available at http://localhost:${PORT}/api/inngest`);
        });
    } catch (error) {
        logger.error("Error starting server:", error);
        process.exit(1);
    }
}

startServer();