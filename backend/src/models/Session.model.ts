import mongoose, { model, Schema } from "mongoose";

export interface ISession extends Document {
    userId: mongoose.Types.ObjectId;
    token: String;
    deviceInfo?: String;
    expiresAt: Date;
    lastActive: Date;
}

const sessionSchema = new Schema<ISession>(
    {
        // userId is a reference to the User model
        userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
        token: {type: String, required: true, unique: true},
        deviceInfo: {type: String},
        expiresAt : {type: Date, required: true},
        lastActive : {type: Date, default: Date.now}
    },
    {timestamps: true}
);

/*Automatically delete session documents after they expire
A TTL (Time-To-Live) index in MongoDB is a special index that automatically deletes documents after a certain time.

This creates a TTL (Time-To-Live) index in MongoDB.
expiresAt: 1 → Use the expiresAt field to track expiration.
expireAfterSeconds: 0 → Document will auto-delete as soon as the expiresAt time is reached.
*/
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model<ISession>("Session", sessionSchema);