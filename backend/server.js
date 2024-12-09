import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRouter from './routers/auth.router.js';
import trackRouter from './routers/tracker.router.js';

dotenv.config();

const app = express();
app.use(express.json()); // allow us to access data

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Server is ready');
});

app.use('/api', authRouter);

app.use('/api/trackerexpense', trackRouter);


app.listen(PORT, () => {
    console.log(`Server is listening to http://localhost:${PORT}`);
    connectDB();
});