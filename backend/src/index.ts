
import express, { urlencoded } from "express";
import { Connection } from "./Connection";
import { config } from "dotenv";
import { userrouter } from "./Routes/user";
import cors from "cors";
import { ApplicantsRouter } from "./Routes/Applicants";

config(); 

export const app = express();


app.use(cors({
    origin: ['https://skillsphere.vercel.app'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    credentials: true, 
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(urlencoded({ extended: false }));


app.use('/user', userrouter);
app.use('/applicant', ApplicantsRouter);


try {
    Connection(process.env.DB_URL!);
    console.log("Connected to the database successfully");
} catch (error) {
    console.error("Error connecting to the database:", error);
}


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
