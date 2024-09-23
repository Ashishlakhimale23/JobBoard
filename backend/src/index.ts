import express, { urlencoded }  from "express";
import { Connection } from "./Connection";
import { config } from "dotenv";
import { userrouter } from "./Routes/user";
import cors from "cors";
config()
const app = express();
app.use(express.json())
app.use(urlencoded({extended:false}))
app.use(cors())
app.use('/user',userrouter)
Connection(process.env.DB_URL!)
app.listen(8000,()=>{
    console.log("Server started")
})