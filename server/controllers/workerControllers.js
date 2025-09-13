import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import workerModel from '../models/workerModel.js';
import { v2 as cloudinary } from 'cloudinary';

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

    // Validate email, password and uniqueness
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

    // Upload profilePic if provided, else use default
    let profilePicUrl = 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';
    if (profilePic) {
      const profilePicRes = await cloudinary.uploader.upload(profilePic.path, { resource_type: 'image' });
      profilePicUrl = profilePicRes.secure_url || profilePicUrl;
    }

    // Upload previous work pics
    let previousWorkPicsUrl = [];
    if (previousWorkPics.length > 0) {
      previousWorkPicsUrl = await Promise.all(
        previousWorkPics.map(async (image) => {
          const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
          return result.secure_url;
        })
      );
    }

    // Upload aadhar
    let aadharPicUrl = '';
    if (aadharPic) {
      const aadharRes = await cloudinary.uploader.upload(aadharPic.path, { resource_type: 'image' });
      aadharPicUrl = aadharRes.secure_url || aadharPicUrl;
    }

    // Upload intro video
    let introVidUrl = null;
    if (introVid) {
      const introVidRes = await cloudinary.uploader.upload(introVid.path, { resource_type: 'video' });
      introVidUrl = introVidRes.secure_url;
    }

    // Prepare safe values
    const finalAvailability = availability ? 'True' : 'False';
    const finalBio = bio || '';

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
      availability: finalAvailability,
      bio: finalBio,
      aadhar,
      price,
      profilePic: profilePicUrl,
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
      return res.status(404).json({ success: false, message: 'User Not Found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = createToken(user._id);
    return res.json({
      success: true,
      message: 'User logged in successfully',
      token,
      user   // 👈 include user details
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await workerModel.findById(id).select("-password"); // hide password
    if (!worker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }
    res.json({ success: true, worker });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const addReview = async (req, res) => {
  try {
    const { id } = req.params; // worker being reviewed
    const { rating, comment, isAnon, name, profilePic } = req.body;
    const clientId = req.user._id;

    if (rating == null || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required'
      });
    }

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Rating and comment are required" });
    }

    if (!name || !profilePic) {
      return res.status(400).json({ success: false, message: "Reviewer name and profilePic are required" });
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
      name,
      profilePic,
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
      message: error
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


export const getProfile = async (req, res) => {
  try {
    const token = req.headers.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token || token.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Token not found'
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const id = token_decode.id;
    const worker = await workerModel.findById(id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    res.json({
      success: true,
      message: 'Worker profile fetched successfully',
      worker
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



