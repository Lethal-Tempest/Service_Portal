import express from 'express'
import { fetchAllWorkers } from '../controllers/userControllers.js';
import { editUserProfile } from '../controllers/editControllers.js';
import authUser from '../middlewares/auth.js';


const userRouter = express.Router();

userRouter.get('/', fetchAllWorkers)
userRouter.put('/profile', authUser, editUserProfile);


export default userRouter;