import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/db.js';
import resumeRouter from './routes/resumeRouter.js';




const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api', resumeRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});