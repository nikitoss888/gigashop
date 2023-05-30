import type {NextFunction, Request, Response} from 'express';
import ApiError from "../errors/ApiError";
import Controller from "./Controller";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, {getUser} from "../models/User";
import {Op} from "sequelize";

const USER = 'USER'
const MODERATOR = 'MODERATOR';
const ADMIN = 'ADMIN';

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
        const { image } = req.body;
        try {
            const { email, login, firstName, lastName, password } = req.body;

            let role = req.body.role?.toUpperCase() || USER;

            const admin = await User.findOne({where: {role: ADMIN}});
            if (!admin) role = ADMIN;
            else if ([ADMIN, MODERATOR].includes(role)) {
                // ToDO: delete image
                //
                // if (image) super.deleteFile(USERS_DIR, image);
                return next(ApiError.badRequest('Тільки адміністратор може створювати ' +
                    'адміністраторів та модераторів'));
            }

            let token = await UserController._createUser(email, login, firstName, lastName,
                password, image, role)
                .catch((e: ApiError | Error | unknown) => {
                    // ToDO: delete image
                    //
                    // if (image) super.deleteFile(USERS_DIR, image);
                    return next(super.exceptionHandle(e));
                });

            return res.json({message: "Реєстрацію пройдено успішно", token});
        }
        catch (e: unknown) {
            // ToDo: delete image
            // if (image) super.deleteFile(USERS_DIR, image);
            return next(super.exceptionHandle(e));
        }
    }

    async createModerator(req: Request, res: Response, next: NextFunction) {
        const { image } = req.body;
        try {
            const { email, login, firstName, lastName, password } = req.body;

            const token = await UserController._createUser(email, login, firstName, lastName,
                password, image, MODERATOR)
                .catch((e: ApiError | Error | unknown) => {
                    // ToDo: delete image
                    // if (image) super.deleteFile(USERS_DIR, image);
                    if (e instanceof ApiError) return next(e);
                    return next(super.exceptionHandle(e));
                });

            return res.json({message: "Успішно створено модератора", token});
        }
        catch (e: unknown) {
            // ToDo: delete image
            // if (image) super.deleteFile(USERS_DIR, image);
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
        return res.json({message: "Авторизацію пройдено успішно", token});
    }

    async check(req: Request, res: Response) {
        const token = UserController.generateJwt(req.user.id, req.user.login, req.user.email, req.user.role);
        return res.json({token});
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const { image } = req.body;
        let error: unknown;
        try {
            const user = await User.findByPk(req.user.id);
            if (!user) {
                // ToDo: delete image
                // if (image) super.deleteFile(USERS_DIR, image);
                return next(ApiError.internal('Користувача не знайдено'));
            }

            const { email, login, firstName, lastName, password, newPassword } = req.body;

            if (!password) {
                // ToDo: delete image
                // if (image) super.deleteFile(USERS_DIR, image);
                return next(ApiError.badRequest('Введіть пароль'));
            }

            await UserController._checkCandidate(email, login).catch((e: unknown ) => {
                // ToDo: delete image
                // if (image) super.deleteFile(USERS_DIR, image);
                error = e;
            });
            if (error) return next(super.exceptionHandle(error));

            if (newPassword) {
                await UserController._checkPassword(newPassword).catch((e: unknown) => {
                    // ToDo: delete image
                    // if (image) super.deleteFile(USERS_DIR, image);
                    error = e;
                });
                if (error) return next(super.exceptionHandle(error));
            }

            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                // ToDo: delete image
                // if (image) super.deleteFile(USERS_DIR, image);
                return next(ApiError.badRequest('Невірний пароль'));
            }

            let oldImageName: string | undefined = user.image;
            if (oldImageName === 'default.png') oldImageName = undefined;

            if (email) user.email = email;
            if (login) user.login = login;
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (newPassword) user.password = bcrypt.hashSync(newPassword, SALT_ROUNDS);
            if (image) user.image = image;

            await user.save().catch((e: unknown) => {
                // ToDo: delete image
                // if (image) super.deleteFile(USERS_DIR, image);
                error = e;
            });
            if (error) return next(super.exceptionHandle(error));

            // ToDo: delete image
            // if (image && oldImageName) super.deleteFile(USERS_DIR, oldImageName);

            const token = UserController.generateJwt(user.id, user.login, user.email, user.role);

            return res.json({message: "Користувача відредаговано успішно", token});
        }
        catch (e: unknown) {
            // ToDo: delete image
            // if (image) super.deleteFile(USERS_DIR, image);
            return next(super.exceptionHandle(e));
        }
    }

    async profile(req: Request, res: Response, next: NextFunction) {
        try {
            let { includeBought, includeCart,
                includeRates,
                includeWishlist, includePublications,
                includePublicationComments } = req.query;

            let includeBoughtItemsParsed = super.parseBoolean(includeBought as string);
            let includeCartParsed = super.parseBoolean(includeCart as string);
            let includeItemsRatesParsed = super.parseBoolean(includeRates as string);
            let includeWishlistParsed = super.parseBoolean(includeWishlist as string);
            let includePublicationsParsed = super.parseBoolean(includePublications as string);
            let includePublicationCommentsParsed = super.parseBoolean(includePublicationComments as string);

            const user = await getUser(req.user.id, includeBoughtItemsParsed, includeCartParsed,
                includeItemsRatesParsed, includeWishlistParsed, includePublicationsParsed,
                includePublicationCommentsParsed);
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