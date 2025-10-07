import express from 'express'
import {signin, signup, getReviews, addReview, getProfile, getWorkerById} from '../controllers/workerControllers.js'
import { editWorkerProfile } from '../controllers/editControllers.js';
import upload from '../middlewares/multer.js';
import authUser from '../middlewares/auth.js';

const workerRouter = express.Router();

workerRouter.post('/signin', signin);
workerRouter.post('/signup', upload.fields([
    {name:'profilePic', maxCount:1}, 
    {name:'aadharPic', maxCount:1}, 
    {name:'previousWorkPics', maxCount:10},
    {name:'introVid', maxCount:1}
]) ,
signup
);

workerRouter.put(
    '/profile', 
    authUser, 
     upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'aadharPic', maxCount: 1 },
    { name: 'previousWorkPics', maxCount: 10 },
    { name: 'introVid', maxCount: 1 },
  ]),
    editWorkerProfile);
workerRouter.get('/profile', authUser, getProfile);
workerRouter.get('/:id/reviews', authUser, getReviews);
workerRouter.post('/:id/addReview', authUser, addReview);
workerRouter.get('/:id', getWorkerById); // keep this last           // 👈 add this (public)

export default workerRouter