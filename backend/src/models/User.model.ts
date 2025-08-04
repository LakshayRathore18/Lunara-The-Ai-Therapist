import mongoose,{Schema, model, Document} from 'mongoose';
import { logger } from '../utils/logger';

// Instance of Iuser has all properties of mongoose Document
interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

// Define the schema for the User model
const userSchema = new Schema<IUser>(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    },
    { timestamps: true}
)

export const User = mongoose.model<IUser>("User", userSchema);
