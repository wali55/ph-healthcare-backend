import express, { Application } from "express";
import cors from "cors";
import { prisma } from "./app/lib/prisma";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "hello"})
})

app.post("/", async(req, res) => {
    const result = await prisma.specialty.create({
        data: {
            title: "Cardiology"
        }
    })
    res.json({success: true, message: "Specialty created successfully", data: result})
})

export default app;