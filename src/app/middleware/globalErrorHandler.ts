import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status";
import z from "zod";

type ErrorSource = {
    path: string,
    message: string
}

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === "development") {
     console.log("Error from global error handler", err);
    }

    const errorSource: ErrorSource[] = [];
    let statusCode: number = status.INTERNAL_SERVER_ERROR;
    let message: string = "Internal server error!";

    if (err instanceof z.ZodError) {
        statusCode = status.BAD_REQUEST;
        message = "Zod validation error!";

        err.issues.forEach(issue => {
            errorSource.push({
                path: issue.path.length > 1 ? issue.path.join(".") : issue.path[0]!.toString(),
                message: issue.message
            })
        })
    }

    return res.status(statusCode).json({
        success: false,
        message: message,
        error: err.message,
        errorSource
    })
}