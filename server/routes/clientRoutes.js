import express from 'express';
import { signin, signup } from '../controllers/clientControllers.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/signin', signin);
userRouter.post('/signup',upload.fields([{name:'profilePic', maxCount:1}]), signup);

export default userRouter;
