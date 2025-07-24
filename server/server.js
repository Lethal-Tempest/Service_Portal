import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./config/database.js";   

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});