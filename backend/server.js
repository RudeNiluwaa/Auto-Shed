import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import examinerRouter from './routes/examiner.routes.js';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 8070;


const URL = process.env.MONGODB_URL;

mongoose.connect(URL)

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.use('/examiner', examinerRouter);

app.listen(PORT, () => {
    console.log(`Appis running on port ${PORT}`);
});