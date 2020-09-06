import { Request, Response, NextFunction } from "express";


// eslint-disable-next-line no-unused-vars
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? "To err is human" : err.stack
    });
};
