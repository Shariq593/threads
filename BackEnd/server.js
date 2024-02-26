import  express  from "express";
import dotenv from "dotenv"
import connectDB from "./db/connectdb.js";
import cookieParser from "cookie-parser";
import userRoutes from "./Routes/userRoutes.js"




dotenv.config() //to read the env file
connectDB();

const app = express();
const PORT = process.env.PORT || 4000

//MiddleWare
app.unsubscribe(express.json) //to parse json data in the req.body
app.use(express.urlencoded({extended:true})) // To parse form data in the req body.
                            //extended is used to parse nested data

app.use(cookieParser())

//Routes
app.use("/api/users",userRoutes)

app.listen(5000, ()=> console.log(`Server Started at http://localhost:${PORT}`));  