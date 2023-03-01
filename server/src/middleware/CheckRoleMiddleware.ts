import type {NextFunction, Request, Response} from 'express';
import ApiError from "../errors/ApiError";
import jwt from "jsonwebtoken";

const checkRoles = (roles: string[]) => {
    // @ts-ignore
    // res is not used
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.method === 'OPTIONS') {
            next();
        }

        try {
            const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

            if (!token) {
                return next(ApiError.unauthorized('Користувач не авторизований'));
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as jwt.JwtPayload;
            if (!roles.includes(decoded.role)) return next(ApiError.forbidden('Немає доступу'));

            next();
        }
        catch (e: unknown) {
            return next(ApiError.unauthorized('Немає доступу'));
        }
    }
}
const checkWorker = checkRoles(['ADMIN', 'MODERATOR']);
const checkAdmin = checkRoles(['ADMIN']);

export default checkRoles;
export {
    checkRoles,
    checkWorker,
    checkAdmin
}