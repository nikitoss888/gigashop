import Item from "./Item";

const sequelize = require('../db');
import {DataTypes, Op} from 'sequelize';
import {ItemRate, PublicationComment} from "./index";
import Publication from "./Publication";

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true, allowNull: false, validate: {len: [4, 20], isAlphanumeric: true}},
    email: {type: DataTypes.STRING, unique: true, allowNull: false, validate: {isEmail: true}},
    image: {type: DataTypes.STRING, allowNull: false, defaultValue: 'default.png'},
    firstName: {type: DataTypes.STRING, allowNull: false, validate: {len: [2, 20], is: /^[a-zA-Z\-']+|[а-яА-ЯЄєЇїІіҐґ\-']+$/}},
    lastName: {type: DataTypes.STRING, allowNull: false, validate: {len: [2, 20], is: /^[a-zA-Z\-']+|[а-яА-ЯЄєЇїІіҐґ\-']+$/}},
    role: {type: DataTypes.STRING, defaultValue: 'USER', allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    isDeleted: {type: DataTypes.BOOLEAN, defaultValue: false},
    isBanned: {type: DataTypes.BOOLEAN, defaultValue: false},
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
const _includeHandler = (includeCart: boolean, includeBoughtItems: boolean, includeItemsRates: boolean, includeWishlist: boolean,
                         includePublications: boolean, includePublicationComments: boolean, includeHidden = false) => {
    let include: {}[] = [];

    if (includeCart) {
        include.push({
            model: Item,
            as: 'Cart',
            attributes: ['id', 'name', 'image', 'releaseDate', 'price', 'hide'],
            where: includeHidden ? {hide: false} : {}
        });
    }

    if (includeBoughtItems) {
        include.push({
            model: Item,
            as: 'Bought',
            attributes: ['id', 'name', 'image', 'releaseDate', 'price', 'hide'],
            where: includeHidden ? {} : {hide: false}
        });
    }

    if (includeItemsRates) {
        include.push({
            model: ItemRate,
            as: 'Rates',
            attributes: ['id', 'rate', 'content', 'itemId', 'createdAt', 'updatedAt', 'violation', 'violation_reason', 'hide'],
        });
    }

    if (includeWishlist) {
        include.push({
            model: Item,
            as: 'Wishlist',
            attributes: ['id', 'name', 'image', 'releaseDate', 'price', 'hide'],
        });
    }

    if (includePublications) {
        include.push({
            model: Publication,
            as: 'Publications',
            attributes: ['id', 'title', 'content', 'violation', 'violation_reason', 'hide'],
            where: includeHidden ? {} : {hide: false}
        });
    }

    if (includePublicationComments) {
        include.push({
            model: PublicationComment,
            as: 'Comments',
            attributes: ['id', 'content', 'rate', 'createdAt', 'updatedAt', 'violation', 'violation_reason', 'hide'],
            where: includeHidden ? {} : {hide: false}
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
                       includePublicationComments= true, hide= false) => {
    let include = _includeHandler(includeCart, includeBoughtItems, includeItemsRates, includeWishlist,
        includePublications, includePublicationComments, hide);

    return User.findByPk(id, {include});
}

export default User;
export {
    User,
    getUsers,
    getUser
}