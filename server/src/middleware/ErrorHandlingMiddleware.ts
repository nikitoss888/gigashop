import type { Request, Response, NextFunction } from 'express';
import ApiError from "../errors/ApiError";

// error handler is last middleware, hence next() is not used
// @ts-ignore
const errorHandler = function (err: Error, req: Request, res: Response, next: NextFunction): Response {
    let status = (err as ApiError).status || 500;
    let errors = (err as ApiError).errors || [];

    let env = process.env.NODE_ENV || 'development';
    return res.status(status).json({ name: err.name, message: err.message,
        errors: errors, stack: env === 'development' ? err.stack : undefined });
}

export default errorHandler;