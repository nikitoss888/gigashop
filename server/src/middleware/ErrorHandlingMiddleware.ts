import type { Request, Response, NextFunction } from 'express';
import ApiError from "../errors/ApiError";

// error handler is last middleware, hence next() is not used
// @ts-ignore
module.exports = function (err: Error, req: Request, res: Response, next: NextFunction): Response {
    let status = (err as ApiError).status || 500;
    let errors = (err as ApiError).errors || [];
    return res.status(status).json({ message: err.message, errors: errors, request: {body: req.body, query: req.query} });
}