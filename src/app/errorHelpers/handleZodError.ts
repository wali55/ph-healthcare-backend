import status from "http-status";
import z from "zod";
import { ErrorResponse, ErrorSource } from "../types/error.type";

export const handleZodError = (err: z.ZodError): ErrorResponse => {
  const statusCode = status.BAD_REQUEST;
  const message = "Zod validation error!";
  const errorSource: ErrorSource[] = [];

  err.issues.forEach((issue) => {
    errorSource.push({
      path:
        issue.path.length > 1
          ? issue.path.join(".")
          : issue.path[0]!.toString(),
      message: issue.message,
    });
  });

  return {
    success: false,
    message,
    errorSource,
    statusCode,
  };
};
