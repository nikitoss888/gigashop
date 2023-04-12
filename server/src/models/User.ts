import ItemRate from "./ItemRate";
import PublicationComment from "./PublicationComment";
import Publication from "./Publication";
import Item from "./Item";

const {sequelize_db} = require('../db');
import {DataTypes, Op} from 'sequelize';

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
        defaultValue: 'default.png'
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
    isBanned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    paranoid: true,
});

const _whereHandler = (login?: string, email?: string, firstName?: string, lastName?: string,
                        role?: string, isDeleted = false, isBanned = false) => {
    let where: {login?: {}, email?: {}, firstName?: {}, lastName?: {}, role?: {}, isDeleted?: {}, isBanned?: {}} = {};

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
    where.isDeleted = isDeleted;
    where.isBanned = isBanned;

    return where;
}

const _includeHandler = (includeBoughtItems: boolean, includeCart: boolean, includeItemsRates: boolean,
                         includeWishlist: boolean, includePublications: boolean, includePublicationComments: boolean) => {
    let include: {}[] = [];

    if (includeCart) {
        include.push({
            model: Item,
            as: 'Cart',
            attributes: ['id', 'name', 'mainImage', 'releaseDate', 'price', 'hide'],
            through: {attributes: []}
        });
    }

    if (includeBoughtItems) {
        include.push({
            model: Item,
            as: 'Bought',
            attributes: ['id', 'name', 'mainImage', 'releaseDate', 'price', 'hide']
        });
    }

    if (includeItemsRates) {
        include.push({
            model: ItemRate,
            as: 'Rates',
            attributes: ['itemId', 'rate', 'content', 'createdAt', 'updatedAt', 'violation', 'violation_reason', 'hide'],
        });
    }

    if (includeWishlist) {
        include.push({
            model: Item,
            as: 'Wishlist',
            attributes: ['id', 'name', 'mainImage', 'releaseDate', 'price', 'hide'],
        });
    }

    if (includePublications) {
        include.push({
            model: Publication,
            as: 'Publications',
            attributes: ['id', 'title', 'content', 'violation', 'violation_reason', 'hide']
        });
    }

    if (includePublicationComments) {
        include.push({
            model: PublicationComment,
            as: 'Comments',
            attributes: ['id', 'content', 'rate', 'createdAt', 'updatedAt', 'violation', 'violation_reason', 'hide']
        });
    }

    return include;
}
const getUsers = async (login?: string, email?: string, firstName?: string, lastName?: string,
                        role?: string, isDeleted = false, isBanned = false) => {
    let where = _whereHandler(login, email, firstName, lastName, role, isDeleted, isBanned);
    return User.findAll({where});
}

const getUser = async (id: number, includeBoughtItems= true, includeCart = true,
                       includeItemsRates= true,
                       includeWishlist= true, includePublications= true,
                       includePublicationComments= true) => {
    let include = _includeHandler(includeBoughtItems, includeCart, includeItemsRates, includeWishlist,
        includePublications, includePublicationComments);

    return User.findByPk(id, {include});
}

export default User;
export {
    User,
    getUsers,
    getUser
}