import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import {cors_options} from "./src/config/cors"

const server = express();

server.use(express.json());
server.use(cors(cors_options));
server.use(morgan("tiny"));

const PORT = process.env.PORT || 3001;

server.use("/", (req:Request, res:Response)=>{res.send("hola")});

server.listen(PORT, ()=>{
    console.log(`Server running on port http://localhost:${PORT}`);
})

