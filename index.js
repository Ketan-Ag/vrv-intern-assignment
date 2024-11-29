import express from "express"
import cors from "cors"
import dotenv from "dotenv";
const app = express();

dotenv.config({
    path: './.env'
})

import http from 'http';
import connectDB from "./db/index.js";
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use(cors());
app.use(express.urlencoded({ extended: true })); 

connectDB()
    .then(() => {
        const h_server = http.createServer(app);
        h_server.listen(PORT || 8000, () => {
            console.log(`⚙️  Server is running at port : ${PORT}`);
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed !! ", err);
    })

import userRouter from "./routes/user.route.js"

app.use("/api/users", userRouter);