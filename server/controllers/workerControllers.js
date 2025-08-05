import workerModel from '../models/workerModel.js'
import bcrypt from 'bcrypt'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from "cloudinary";

const createToken = (id) => {
    // console.log(id, process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

export const signup = async (req, res) => {
    try {
        const {name, email, password, phone, location, occupation, skills, experience, availability, bio, aadhar} = req.body;
        const profilePic = req.files?.profilePic?.[0];
        const previousWorkPics = req.files?.previousWorkPics;
        const aadharPic = req.files?.aadharPic[0];
        const introVid = req.files?.introVid[0];
        const uploadResult = await cloudinary.uploader.upload(profilePic.path, { resource_type: "image" });
        const profilePicUrl = uploadResult.secure_url;
        let previousWorkPicsUrl=await Promise.all(
            previousWorkPics.map(async(image)=>{
                let result=await cloudinary.uploader.upload(image.path, {resource_type: "image"});
                return result.secure_url;
            })
        )
        let aadharResponse=await cloudinary.uploader.upload(aadharPic.path, {resource_type: "image"});
        let aadharPicUrl=aadharResponse.secure_url;
        let introVidResponse=await cloudinary.uploader.upload(introVid.path, {resource_type: "video"});
        let introVidUrl=introVidResponse.secure_url;
        const exists = await workerModel.findOne({ email });
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

        const user = new workerModel({
            name,
            email,
            password: hashedPassword,
            phone,
            location,
            occupation,
            skills,
            experience,
            availability,
            bio,
            aadhar,
            profilePicUrl,
            previousWorkPicsUrl,
            aadharPicUrl,
            introVidUrl
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
    // console.log(req.body);
}

export const signin = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        const user = await workerModel.findOne({ email });
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





