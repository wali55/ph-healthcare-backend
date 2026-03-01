import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", IndexRoutes);

app.get("/", (req, res) => {
    res.json({message: "hello"})
})

app.use(globalErrorHandler);
app.use(notFound);

export default app;