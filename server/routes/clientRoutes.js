import express from 'express';
import { signin, signup, verifyEmail, resendEmailOTP } from '../controllers/clientControllers.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

// Auth
userRouter.post('/signin', signin); // body: { identifier, password }  // email or phone
userRouter.post('/signup', upload.fields([{ name: 'profilePic', maxCount: 1 }]), signup);

// Email OTP
userRouter.post('/verify-email', verifyEmail);      // body: { email, otp }
userRouter.post('/resend-email-otp', resendEmailOTP); // body: { email }

export default userRouter;
