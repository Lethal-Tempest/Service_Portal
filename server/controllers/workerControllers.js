import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import workerModel from '../models/workerModel.js';
import {v2 as cloudinary} from 'cloudinary';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
}

export const signup = async (req, res) => {
  try {
    const {
      name, email, password, phone, location,
      occupation, skills, experience, availability,
      bio, aadhar, price
    } = req.body;

    const profilePic = req.files?.profilePic?.[0];
    const previousWorkPics = req.files?.previousWorkPics || [];
    const aadharPic = req.files?.aadharPic?.[0];
    const introVid = req.files?.introVid?.[0];

    const missing = [];
    if (!profilePic) missing.push('profilePic');
    if (!aadharPic) missing.push('aadharPic');
    if (!introVid) missing.push('introVid');
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required file field(s): ${missing.join(', ')}.`
      });
    }

    const exists = await workerModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // upload assets
    const profilePicRes = await cloudinary.uploader.upload(profilePic.path, { resource_type: 'image' });
    const profilePicUrl = profilePicRes.secure_url;

    const previousWorkPicsUrl = await Promise.all(
      previousWorkPics.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    const aadharRes = await cloudinary.uploader.upload(aadharPic.path, { resource_type: 'image' });
    const aadharPicUrl = aadharRes.secure_url;

    const introVidRes = await cloudinary.uploader.upload(introVid.path, { resource_type: 'video' });
    const introVidUrl = introVidRes.secure_url;

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
      price,
      profilePicUrl,
      previousWorkPicsUrl,
      aadharPicUrl,
      introVidUrl
    });

    const newUser = await user.save();
    const token = createToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const signin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await workerModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User Not Found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = createToken(user._id);
    return res.json({
      success: true,
      message: 'User logged in successfully',
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const addReview = async (req, res) => {
  try {
    const { id } = req.params; // worker being reviewed
    const { rating, comment, isAnon } = req.body;
    const clientId = req.userId;

    if (rating == null || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required'
      });
    }

    const worker = await workerModel.findById(id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    worker.reviews.push({
      rating,
      comment,
      clientId,
      isAnon: !!isAnon,
      date: new Date()
    });

    await worker.save();

    return res.json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await workerModel.findById(id).select('reviews');
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    res.json({
      success: true,
      message: 'Reviews fetched successfully',
      reviews: worker.reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};






