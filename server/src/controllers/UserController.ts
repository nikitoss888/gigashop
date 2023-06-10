import type {NextFunction, Request, Response} from 'express';
import ApiError from "../errors/ApiError";
import Controller from "./Controller";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { getUser, getUsers } from "../models/User";
import {Op} from "sequelize";
import ItemCart from "../models/ItemCart";
import { ItemBought } from "../models";
import { v4 as uuidv4 } from 'uuid';

const USER = 'USER'
const MODERATOR = 'MODERATOR';
const ADMIN = 'ADMIN';

const SALT_ROUNDS = 5;

class UserController extends Controller {
    static generateJwt(id: number, login: string, email: string, role: string, image: string) {
        return jwt.sign({
            id, login, email, role, image,
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

        return UserController.generateJwt(user.id, user.login, user.email, user.role, user.image);
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

        const token = UserController.generateJwt(user.id, user.login, user.email, user.role, user.image);
        return res.json({message: "Авторизацію пройдено успішно", token});
    }

    async check(req: Request, res: Response) {
        const token = UserController.generateJwt(req.user.id, req.user.login, req.user.email, req.user.role, req.user.image);
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

            const token = UserController.generateJwt(user.id, user.login, user.email, user.role, user.image);

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

            let includeBoughtItemsParsed = super.parseBoolean(includeBought as string) || false;
            let includeCartParsed = super.parseBoolean(includeCart as string) || false;
            let includeItemsRatesParsed = super.parseBoolean(includeRates as string) || false;
            let includeWishlistParsed = super.parseBoolean(includeWishlist as string) || false;
            let includePublicationsParsed = super.parseBoolean(includePublications as string) || false;
            let includePublicationCommentsParsed = super.parseBoolean(includePublicationComments as string) || false;

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

    async setUpCart(req: Request, res: Response, next: NextFunction) {
        try {
            const reqUser = req.user;
            const transactionId = uuidv4();

            const cart = await ItemCart.findAll({ where: { userId: reqUser.id }});
            if (!cart || cart.length === 0) return next(ApiError.badRequest('Кошик порожній'));

            const setupResult = ItemCart.update({ transactionId }, { where: { userId: reqUser.id }});

            if (!setupResult) return next(ApiError.internal('Помилка при встановленні транзакції'));

            return res.json({message: "Транзакцію встановлено успішно"});

            // const itemsIds = cart.map((item: typeof ItemCart) => item.itemId);
            // const items = await Item.findAll({ where: { id: itemsIds }});
            // const type = "pay";
            // const description = "Оплата товарів";
            // const amount = items.reduce((sum: number, item: typeof Item) => sum + item.price, 0);
            // const currency = "UAH";
            //
            // const client_url = "http://localhost:3000/cart/success";
            // const server_url = (process.env.NGROK_SERVER_URL || 'http://localhost:5000') + `/api/user/cart/success/${transactionId}`;
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async buyCart(req: Request, res: Response, next: NextFunction) {
        try {
            const { transactionId } = req.params;

            const cart = await ItemCart.findAll({ where: { transactionId }});
            if (!cart || cart.length === 0) return next(ApiError.badRequest('Кошик порожній'));

            const userId = cart[0].userId;
            const ids = cart.map((item: typeof ItemCart) => item.itemId);

            const bought = await ItemBought.create({ userId, itemId: ids });
            await ItemCart.destroy({where: { transactionId }});

            return res.json({message: 'Товари успішно придбані', bought});
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async allUsers(req: Request, res: Response, next: NextFunction) {
        const {
            login,
            email,
            firstName,
            lastName,
            role,
        } = req.query;
        const isDeleted = super.parseBoolean(req.query.isDeleted as string) || false;
        const isBanned = super.parseBoolean(req.query.isBanned as string) || false;

        const result = await getUsers({
            login: login as string,
            email: email as string,
            firstName: firstName as string,
            lastName: lastName as string,
            role: role as string,
            isDeleted,
            isBanned,
        })
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
        });
        if (!result) return next(ApiError.internal('Помилка отримання користувачів'));

        const { users, totalCount } = result;

        if (!users) return next(ApiError.internal('Користувачів не знайдено'));

        return res.json({users, totalCount});
    }

    async test(req: Request, res: Response) {
        res.json({message: `User route works!!!!`, request: {body: req.body, query: req.query}})
    }
}

export default new UserController();