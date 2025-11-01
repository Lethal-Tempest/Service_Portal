import express from 'express';
import {
  signin,
  signup,
  getReviews,
  addReview,
  getProfile,
  getWorkerById,
  verifyEmail,
  resendEmailOTP
} from '../controllers/workerControllers.js';
import { editWorkerProfile } from '../controllers/editControllers.js';
import upload from '../middlewares/multer.js';
import authUser from '../middlewares/auth.js';

const workerRouter = express.Router();

// Auth
workerRouter.post('/signin', signin); // body: { identifier, password }
workerRouter.post(
  '/signup',
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'aadharPic', maxCount: 1 },
    { name: 'previousWorkPics', maxCount: 10 },
    { name: 'introVid', maxCount: 1 },
  ]),
  signup
);

// Email OTP
workerRouter.post('/verify-email', verifyEmail);        // body: { email, otp }
workerRouter.post('/resend-email-otp', resendEmailOTP); // body: { email }

// Profile
workerRouter.put(
  '/profile',
  authUser,
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'aadharPic', maxCount: 1 },
    { name: 'previousWorkPics', maxCount: 10 },
    { name: 'introVid', maxCount: 1 },
  ]),
  editWorkerProfile
);
workerRouter.get('/profile', authUser, getProfile);

// Reviews
workerRouter.get('/:id/reviews', authUser, getReviews);
workerRouter.post('/:id/addReview', authUser, addReview);

// Public worker fetch (keep last)
workerRouter.get('/:id', getWorkerById);

export default workerRouter;
