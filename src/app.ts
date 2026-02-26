import express, { Application } from "express";
import cors from "cors";
import { IndexRoutes } from "./app/routes";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", IndexRoutes);

app.get("/", (req, res) => {
    res.json({message: "hello"})
})

export default app;