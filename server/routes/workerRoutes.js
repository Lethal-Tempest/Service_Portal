import express from 'express'
import {signin, signup} from '../controllers/workerControllers.js'
import upload from '../middlewares/multer.js';

const workerRouter = express.Router();

workerRouter.post('/signin', signin);
workerRouter.post('/signup', upload.fields([{name:'profilePic', maxCount:1}, {name:'aadharPic', maxCount:1}, {name:'previousWorkPics', maxCount:10}, {name:'introVid', maxCount:1}]) ,signup);

export default workerRouter