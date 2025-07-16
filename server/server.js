import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB.js';

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser()); // Required for handling cookies
app.use(
  cors({
    origin: process.env.FRONTEND_URL_PRODUCTION, // frontend origin for dev
    // origin: process.env.FRONTEND_URL_PRODUCTION, // frontend origin for production
    credentials: true, // ✅ Allow cookies to be sent
  })
);

// Routes
import authRoutes from './routes/authRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import saveResumeRoutes from './routes/saveResumeRoutes.js'

app.use('/api/', authRoutes); // authentication
app.use('/api/upload', uploadRoutes); // upload resume to check ats score
app.use('/api/resume', saveResumeRoutes); // CRUD Resume to db


// app.get("/", (req, res) => {
//   res.send("Server is running ✅");
// });



const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`server listening at : ${PORT}`);
  connectDB();
})