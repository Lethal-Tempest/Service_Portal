import express from 'express'
import { fetchAllWorkers } from '../controllers/userControllers.js';

const userRouter = express.Router();

userRouter.get('/', fetchAllWorkers)

export default userRouter;