import ItemRate from "./ItemRate";
import PublicationComment from "./PublicationComment";
import Publication from "./Publication";
import Item from "./Item";

const {sequelize_db} = require('../db');
import {DataTypes, Op} from 'sequelize';
import { ItemBought } from "./index";

const User = sequelize_db.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    login: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            len: {args: [4, 20], msg: 'Поле "Логін" повинно бути довжиною від 4 до 20 символів'},
            isAlphanumeric: {msg: 'Поле "Логін" повинно містити лише літери латинського алфавіту та цифри'},
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {msg: 'Поле "Email" повинно бути валідним email-адресом'},
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'https://res.cloudinary.com/dnqlgypji/image/upload/v1686310061/gigashop/users/r7mocr34rjlgfissqkaf.jpg'
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {args: [2, 20], msg: 'Поле "Ім\'я" повинно бути довжиною від 2 до 20 символів'},
            is: {args: /^[A-Z][a-zA-Z\-']+$|^[А-ЯЄЇІҐ][а-яА-ЯЄєЇїІіҐґ\-']+$/, msg: 'Поле "Ім\'я" повинно містити лише літери'}
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {args: [2, 20], msg: 'Поле "Прізвище" повинно бути довжиною від 2 до 20 символів'},
            is: {args: /^[A-Z][a-zA-Z\-']+$|^[А-ЯЄЇІҐ][а-яА-ЯЄєЇїІіҐґ\-']+$/, msg: 'Поле "Прізвище" повинно містити лише літери'}
        }
    },
    role: {
        type: DataTypes.ENUM('USER', 'MODERATOR', 'ADMIN'),
        defaultValue: 'USER',
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    paranoid: true,
});

const _whereHandler = (login?: string, email?: string, firstName?: string, lastName?: string,
                        role?: string, isBlocked = false) => {
    let where: {login?: {}, email?: {}, firstName?: {}, lastName?: {}, role?: {}, isBlocked?: {}} = {};

    if (login) {
        where.login = {
            [Op.like]: `%${login}%`
        }
    }
    if (email) {
        where.email = {
            [Op.like]: `%${email}%`
        }
    }
    if (firstName) {
        where.firstName = {
            [Op.like]: `%${firstName}%`
        }
    }
    if (lastName) {
        where.lastName = {
            [Op.like]: `%${lastName}%`
        }
    }
    if (role) {
        where.role = {
            [Op.like]: `%${role}%`
        }
    }
    if (isBlocked) {
        where.isBlocked = {
            [Op.or]: [isBlocked, false]
        };
    }

    return where;
}

const _includeHandler = (includeBoughtItems: boolean, includeCart: boolean, includeItemsRates: boolean,
                         includeWishlist: boolean, includePublications: boolean, includePublicationComments: boolean) => {
    let include: {}[] = [];

    if (includeCart) {
        include.push({
            model: Item,
            as: 'Cart',
            through: {attributes: ["transactionId"]},
            required: false
        });
    }

    console.log({ includeBoughtItems });
    if (includeBoughtItems) {
        include.push({
            model: ItemBought,
            as: 'Bought',
            required: false
        });
    }

    if (includeItemsRates) {
        include.push({
            model: ItemRate,
            as: 'Rates',
            include: [{
                model: Item,
                as: 'Item',
            }],
            required: false
        });
    }

    if (includeWishlist) {
        include.push({
            model: Item,
            as: 'Wishlist',
            through: {attributes: []},
            required: false
        });
    }

    if (includePublications) {
        include.push({
            model: Publication,
            as: 'Publications',
            required: false
        });
    }

    if (includePublicationComments) {
        include.push({
            model: PublicationComment,
            as: 'CommentsList',
            required: false
        });
    }

    return include;
}
type getUsersParams = {
    login?: string,
    email?: string,
    firstName?: string,
    lastName?: string,
    role?: string,
    isBlocked?: boolean,
    sortBy?: string,
    descending?: boolean,
    page?: number,
    limit?: number
}
const getUsers = async ({login, email, firstName, lastName, role, isBlocked = true, limit = 10, page = 1, sortBy = 'login', descending = false}: getUsersParams) => {
    const where = _whereHandler(login, email, firstName, lastName, role, isBlocked);
    const totalCount = await User.count();
    const users = await User.findAll({
        where,
        limit,
        offset: (page - 1) * limit,
        order: [[sortBy, descending ? 'DESC' : 'ASC']],
        attributes: {exclude: ['password']}
    });

    return {
        users,
        totalCount,
    };
}

type getUserParams = {
    id: number,
    includeBoughtItems?: boolean,
    includeCart?: boolean,
    includeItemsRates?: boolean,
    includeWishlist?: boolean,
    includePublications?: boolean,
    includePublicationComments?: boolean
}
const getUser = async ({ id, includeBoughtItems = false, includeCart = false, includeItemsRates = false,
                           includeWishlist = false, includePublications = false, includePublicationComments = false }: getUserParams) => {
    let include = _includeHandler(includeBoughtItems, includeCart, includeItemsRates, includeWishlist,
        includePublications, includePublicationComments);

    const user = await User.findByPk(id, { include, attributes: {exclude: ['password']} })
    console.log({ bought: user.Bought });
    const ids = user.Bought ? user.Bought.map((item: any) => item.itemId) : [];

    const boughtItems = ids.length > 0 ? await Item.findAll({
        where: {
            id: {
                [Op.in]: ids
            }
        }
    }) : [];

    return { user, boughtItems };
}

export default User;
export {
    User,
    getUsers,
    getUser
}