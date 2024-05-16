import dotenv from 'dotenv';
dotenv.config();


import { dbConnect } from './configs/database.config';
import express from "express";
import cors from "cors";

import userRouter from './routers/user.router';
import candidateRouter from './routers/candidate.router';
import miscRouter from "./routers/misc.router"

dbConnect();

const app = express();


app.use(cors({
    origin: ["https://wildvote.netlify.app", "http://localhost:4200"],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.options('*', cors());


app.use("/api/users/", userRouter);
app.use("/api/candidates/", candidateRouter);
app.use("/api/misc/", miscRouter);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://wildvote.netlify.app");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Website is served on http://localhost:" +port);
})