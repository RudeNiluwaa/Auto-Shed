import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import examinerRouter from './routes/examiner.routes.js';
import rescheduleRouter from './routes/reschedule.routes.js';
//import presentationRouter from './routes/presentation.routes.js';
import authRouter from './routes/auth.router.js';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
const PORT = process.env.PORT || 8070;


const URL = process.env.MONGODB_URL;

mongoose.connect(URL)

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.use('/examiner', examinerRouter);
app.use('/reschedule', rescheduleRouter);
//app.use('/presentation', presentationRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});