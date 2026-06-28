import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./Routes/userRoutes.js";
import connectDB from "./db/connectDB.js";
import postRoutes from "./Routes/postRoutes.js";
import {v2 as cloudinary} from "cloudinary";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const allowedOrigins = [
    "http://localhost:3000",
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
];
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true
}));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//Routes
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)

app.listen(PORT, ()=> console.log(`Server Started at http://localhost:${PORT}`));       