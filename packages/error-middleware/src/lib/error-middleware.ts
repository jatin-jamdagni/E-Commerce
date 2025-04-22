/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { AppError } from "./errorClass.js";
export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    console.error(`Error ${req.method} ${req.url}: ${err.message}`);
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.details && { details: err.details }),
      // ...(process.env.NODE_ENV === "development" && { stack: err.stack }),

    });
  }

  console.error("unhandled error", err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong, please try again later.",
  })
}
