// This file sets up a logger using the winston library
// It logs messages to files and the console, depending on the environment

import winston from "winston";

// Configure the logger
// It logs to files and the console in development mode
// Error logs go to "error.log" and all logs go to "combined.log"
// In production, it only logs to files
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),

    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});

// In development, also log to the console with colorized output
// This is useful for debugging during development
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

export { logger };