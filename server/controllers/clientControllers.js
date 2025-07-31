import clientModel from '../models/clientModel.js'
import bcrypt from 'bcrypt'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from "cloudinary";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

export const signup = async (req, res) => {
    try {
        const {name, email, password, phone, location} = req.body;
        const profilePic = req.files?.profilePic?.[0];
        const uploadResult = await cloudinary.uploader.upload(profilePic.path, { resource_type: "image" });
        const profilePicUrl = uploadResult.secure_url;
        const exists = await clientModel.findOne({ email });
        if (exists) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Invalid email"
            });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new clientModel({
            name,
            email,
            password: hashedPassword,
            phone,
            location,
            profilePicUrl
        });

        const newUser = await user.save();
        const token = createToken(newUser._id);

        res.json({
            success: true,
            message: "User registered successfully",
            token
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
    console.log(req.body);
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await clientModel.findOne({ email });
        if (!user) {
            res.json({
                success: false,
                message: "User does not exist"
            })
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = createToken(user._id);
            res.json({
                success: true,
                message: "User logged in successfully",
                token
            })
        }
        else {
            res.json({
                success: false,
                message: "Invalid credentials"
            })
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}