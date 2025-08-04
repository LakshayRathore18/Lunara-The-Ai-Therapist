import express, { Request, Response } from 'express';
import { logger } from "./utils/logger";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set up the "/api/inngest" routes
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// Start the server
const startServer = async () => {
    try {
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