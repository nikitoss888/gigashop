import type {NextFunction, Request, Response} from 'express';
import ApiError from "../errors/ApiError";
import Controller from "./Controller";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import {Op} from "sequelize";

const USER = 'USER'
const MODERATOR = 'MODERATOR';
const ADMIN = 'ADMIN';

const USERS_DIR = 'users';
const SALT_ROUNDS = 5;

class UserController extends Controller {

    static generateJwt(id: number, login: string, email: string, role: string) {
        return jwt.sign({
            id, login, email, role
        }, process.env.SECRET_KEY as string, {expiresIn: '24h'});
    }

    private static async _createUser(email: string, login: string, firstName: string, lastName: string,
                                     password: string, imageName: string | undefined, role: string) {
        const hashPasswordValid = await UserController._validateData(email, login, firstName, lastName, password)
            .catch((e: ApiError) => {
                throw e;
            });

        const user = await User.create({
            email, login, firstName, lastName, password: hashPasswordValid, image: imageName, role
        });

        return UserController.generateJwt(user.id, user.login, user.email, user.role);
    }

    private static async _validateData(email: string, login: string, firstName: string,
                              lastName: string, password: string): Promise<string> {
        if (!email || !login || !firstName || !lastName || !password) {
            throw ApiError.badRequest('Не всі поля заповнені');
        }

        await UserController._checkCandidate(email, login).catch((e: ApiError) => {
            throw e
        });

        await UserController._checkPassword(password).catch((e: ApiError) => {
            throw e
        });

        return await bcrypt.hash(password, SALT_ROUNDS);
    }

    private static async _checkCandidate(email = '', login = '') {
        const candidate = await User.findOne({ where: {
                [Op.or]: [
                    { email },
                    { login }
                ]}
        });
        if (candidate) {
            throw ApiError.badRequest('Користувач з таким email або логіном вже існує');
        }
    }

    private static async _checkPassword(password: string) {
        if (password.length < 6) {
            throw ApiError.badRequest('Пароль має бути не менше 6 символів');
        }

        let passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/);
        if (!passwordRegex.test(password)) {
            throw ApiError.badRequest('Пароль повинен містити хоча б одну велику літеру, ' +
                'одну малу літеру та одну цифру');
        }
    }

    async register(req: Request, res: Response, next: NextFunction) {
        const image = req.file;
        let imageName: string | undefined = undefined;
        if (image) {
            imageName = image.filename;
        }
        try {
            let role = req.body.role?.toUpperCase() || USER;

            const admin = await User.findOne({where: {role: ADMIN}});
            if (!admin) role = ADMIN;
            else if ([ADMIN, MODERATOR].includes(role)) {
                if (imageName) super.deleteFile(USERS_DIR, imageName);
                return next(ApiError.badRequest('Тільки адміністратор може створювати ' +
                    'адміністраторів та модераторів'));
            }

            const { email, login, firstName, lastName, password } = req.body;

            let token = await UserController._createUser(email, login, firstName, lastName,
                password, imageName, role)
                .catch((e: ApiError | Error | unknown) => {
                    if (imageName) super.deleteFile(USERS_DIR, imageName);
                    return next(super.exceptionHandle(e));
                });

            return res.json({token});
        }
        catch (e: unknown) {
            if (imageName) super.deleteFile(USERS_DIR, imageName);
            return next(super.exceptionHandle(e));
        }
    }

    async createModerator(req: Request, res: Response, next: NextFunction) {
        const image = req.file;
        let imageName: string | undefined = undefined;
        if (image) {
            imageName = image.filename;
        }
        try {
            const token = await UserController._createUser(req.body.email, req.body.login,
                req.body.firstName, req.body.lastName,
                req.body.password, imageName, MODERATOR)
                .catch((e: ApiError | Error | unknown) => {
                    if (imageName) super.deleteFile(USERS_DIR, imageName);
                    if (e instanceof ApiError) return next(e);
                    return next(super.exceptionHandle(e));
                });

            return res.json({token});
        }
        catch (e: unknown) {
            if (imageName) super.deleteFile(USERS_DIR, imageName);
            return next(super.exceptionHandle(e));
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const { credentials, password } = req.body;

        if (!credentials || !password) {
            return next(ApiError.badRequest('Некоректні дані'));
        }

        const user = await User.findOne({ where: {
                [Op.or]: [
                    { email: credentials },
                    { login: credentials }
                ]}
        });
        if (!user) {
            return next(ApiError.badRequest('Користувача з таким email або логіном не існує'));
        }

        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.badRequest('Невірний пароль'));
        }

        const token = UserController.generateJwt(user.id, user.login, user.email, user.role);
        return res.json({token});
    }

    async check(req: Request, res: Response) {
        const token = UserController.generateJwt(req.user.id, req.user.login, req.user.email, req.user.role);
        return res.json({token});
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const image = req.file;
        let imageName: string | undefined = undefined;
        if (image) {
            imageName = image.filename;
        }
        try {
            const user = await User.findByPk(req.user.id);
            if (!user) {
                if (imageName) super.deleteFile(USERS_DIR, imageName);
                return next(ApiError.internal('Користувача не знайдено'));
            }

            const { email, login, firstName, lastName, password, newPassword } = req.body;

            if (!password) {
                if (imageName) super.deleteFile(USERS_DIR, imageName);
                return next(ApiError.badRequest('Введіть пароль'));
            }

            await UserController._checkCandidate(email, login).catch((e: unknown ) => {
                if (imageName) super.deleteFile(USERS_DIR, imageName);
                return next(super.exceptionHandle(e));
            });

            if (newPassword) {
                await UserController._checkPassword(newPassword).catch((e: unknown) => {
                    if (imageName) super.deleteFile(USERS_DIR, imageName);
                    return next(super.exceptionHandle(e));
                });
            }

            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                if (imageName) super.deleteFile(USERS_DIR, imageName);
                return next(ApiError.badRequest('Невірний пароль'));
            }

            if (email) user.email = email;
            if (login) user.login = login;
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (newPassword) user.password = bcrypt.hashSync(newPassword, SALT_ROUNDS);
            if (imageName) user.image = imageName;

            let oldImageName: string | undefined = user.image;

            await user.save().catch((e: unknown) => {
                if (imageName) super.deleteFile(USERS_DIR, imageName);
                return next(super.exceptionHandle(e));
            });

            if (imageName && oldImageName) super.deleteFile(USERS_DIR, oldImageName);

            const token = UserController.generateJwt(user.id, user.login, user.email, user.role);

            return res.json({user, token});
        }
        catch (e: unknown) {
            if (imageName) super.deleteFile(USERS_DIR, imageName);
            return next(super.exceptionHandle(e));
        }
    }

    async profile(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await User.findByPk(req.user.id, {include: {all: true}});
            if (!user) {
                return next(ApiError.internal('Користувача не знайдено'));
            }
            return res.json(user);
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async test(req: Request, res: Response) {
        res.json({message: `User route works!!!!`, request: {body: req.body, query: req.query}})
    }
}

export default new UserController();