import {NextFunction, Request, Response} from 'express';
import ApiError from "../errors/ApiError";
import jwt from "jsonwebtoken";

// @ts-ignore
// res is not used
const auth = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return next(ApiError.unauthorized('Користувач не авторизований'));
        }

        req.user = jwt.verify(token, process.env.SECRET_KEY as string);
        next();
    }
    catch (e: unknown) {
        return next(ApiError.unauthorized('Немає доступу'));
    }
}

export default auth;