import type {Request, Response, NextFunction} from 'express';
import ApiError from "../errors/ApiError";

class UserController {
    // async register(req: Request, res: Response) {
    //     const { login, email, firsName, lastName, password } = req.body;
    //     const user = await User.create({ login, email, firsName, lastName, password, role: 'USER' });
    //     res.json(user);
    // }

    // async login(req: Request, res: Response) {
    //
    // }
    //
    async check(req: Request, res: Response, next: NextFunction) {
        const { id } = req.query;
        if (!id) {
            return next(ApiError.badRequest('Не вказано ID користувача'));
        }
        res.json(id);
    }

    async test(req: Request, res: Response) {
        res.json({message: `User route works!!!!`, request: {body: req.body, query: req.query}})
    }
}

export default new UserController();