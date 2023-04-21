import type { Request, Response, NextFunction } from 'express';
import ApiError from "../errors/ApiError";

// error handler is last middleware, hence next() is not used
// @ts-ignore
const errorHandler = function (err: Error | ApiError, req: Request, res: Response, next: NextFunction): Response {
    let status = (err as ApiError).status || 500;
    let errors = (err as ApiError).errors || [];

    let env = process.env.NODE_ENV || 'development';
    if (env.toLowerCase() === 'development') console.error(err);
    return res.status(status).json({ name: err.name, message: err.message,
        errors: errors, stack: env.toLowerCase() === 'development' ? err.stack : undefined });
}

export default errorHandler;