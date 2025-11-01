// controllers/workerControllers.js (append these)
import workerModel from '../models/workerModel.js';
import { sendOTPEmail } from '../utils/mailer.js';
import { isEmail, isIndianMobile, generateOTP, otpExpiryDate } from '../utils/authHelpers.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Verify email OTP
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!isEmail(email) || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP required' });
    }
    const user = await workerModel.findOne({ email }).select('+emailOTP +emailOTPExpires');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.emailVerified) return res.json({ success: true, message: 'Email already verified' });

    if (!user.emailOTP || !user.emailOTPExpires) {
      return res.status(400).json({ success: false, message: 'No OTP found, please resend' });
    }
    if (String(user.emailOTP) !== String(otp)) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (new Date() > new Date(user.emailOTPExpires)) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    user.emailVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password, emailOTP, emailOTPExpires, ...safe } = user.toObject();
    return res.json({ success: true, message: 'Email verified', token, user: safe });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Resend email OTP
export const resendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Valid email required' });
    }
    const user = await workerModel.findOne({ email }).select('+emailOTP +emailOTPExpires');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.emailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    const otp = generateOTP();
    user.emailOTP = otp;
    user.emailOTPExpires = otpExpiryDate(10);
    await user.save();

    await sendOTPEmail(email, otp);
    return res.json({ success: true, message: 'OTP resent to email' });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Update worker signin to accept identifier
export const signin = async (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Identifier and password required' });
    }

    const query = isEmail(identifier)
      ? { email: identifier.toLowerCase().trim() }
      : isIndianMobile(identifier) ? { phone: String(identifier).replace(/\D/g, '') } : null;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Enter valid email or Indian phone' });
    }

    const user = await workerModel.findOne(query).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User Not Found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ success: false, message: 'Email not verified' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: _pw, ...safeUser } = user.toObject();
    return res.json({
      success: true,
      message: 'User logged in successfully',
      token,
      user: safeUser
    });
  } catch (error) {
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



