import  express  from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import userRoutes from "./Routes/userRoutes.js"
import connectDB from "./db/connectDB.js";
import postRoutes from "./Routes/postRoutes.js"





dotenv.config() //to read the env file
connectDB();

const app = express();
const PORT = process.env.PORT || 4000

//MiddleWare
app.use(express.json()) //to parse json data in the req.body
app.use(express.urlencoded({extended:true})) // To parse form data in the req body.
                            //extended is used to parse nested data

app.use(cookieParser())

//Routes
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)

app.listen(5000, ()=> console.log(`Server Started at http://localhost:${PORT}`));       