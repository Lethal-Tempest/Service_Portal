import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js';
import clientRouter from './routes/clientRoutes.js';
import workerRouter from './routes/workerRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();
connectCloudinary();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.use(express.json());
app.use(cors({
  origin: 'https://service-portal-noyb.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api/users', userRouter);
app.use('/api/client', clientRouter);
app.use('/api/worker', workerRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

