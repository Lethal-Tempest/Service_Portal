import express from 'express';
import { getUserProfile } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/profile', authenticate, getUserProfile);

export default router;