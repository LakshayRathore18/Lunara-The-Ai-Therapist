import { Request, Response } from 'express';
import { User } from '../models/User.model';
import { Session } from '../models/Session.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// signup
export const signup = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !password || !email){
            return res.status(404).json({message : "Name, Email, Password are Required"})
        } 

        // check if user exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({message : "User already exists"})
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user
        const user = new User({name: name, password: hashedPassword, email: email});
        await user.save();

        // generate jwt token

        // response;
        return res.status(201).json({
            user : {_id: user._id, name : user.name, email : user.email},
            message : "User registered succesfully."
        })

    } catch (error) {
        return res.status(500).json({message : "Server error", error});
    }
}