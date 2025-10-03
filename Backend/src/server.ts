import express, { Router } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { corsOptions } from "./config/cors";

const server = express();

dotenv.config();

server.use(express.json());
server.use(morgan("tiny"));
server.use(cors(corsOptions));

const PORT = process.env.PORT || 3001;

//server.use("/", indexRouter);

server.listen(PORT, ()=>{
    console.log(`Server running on Port ${PORT}`);
})

server.use((req, res)=>{
    res.redirect("/");
})