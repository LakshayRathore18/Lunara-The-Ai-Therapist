import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "ai-therapist" });

// Export functions from the functions file
export { functions } from "./function";