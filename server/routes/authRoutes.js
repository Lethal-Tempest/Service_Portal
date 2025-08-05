import express from 'express';
import {
  userSignup,
  userLogin
} from '../controllers/userControllers.js';

import {
  workerSignup,
  workerLogin
} from '../controllers/workerControllers.js';

const router = express.Router();

// User Auth
router.post('/user/signup', userSignup);
router.post('/user/login', userLogin);

// Worker Auth
router.post('/worker/signup', workerSignup);
router.post('/worker/login', workerLogin);

export default router;

