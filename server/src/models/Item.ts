import {Company, Genre} from "./index";

const sequelize = require('../db');
import {DataTypes, Op} from 'sequelize';

const Item = sequelize.define('item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT},
    price: {type: DataTypes.FLOAT, allowNull: false},
    discount: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    discountFrom: {type: DataTypes.DATE, allowNull: true},
    discountTo: {type: DataTypes.DATE, allowNull: true},
    discountSize: {type: DataTypes.FLOAT, allowNull: true},
    image: {type: DataTypes.STRING, allowNull: false, defaultValue: 'default_item.jpg'},
    hide: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
});
const getItems = async (name?: string, description?: string, price?: number, discount?: boolean,
                        discountFrom?: string, discountTo?: string, discountSize?: number, hide = false) => {
    let where: {name?: {}, description?: {}, price?: {}, discount?: {}, discountFrom?: {}, discountTo?: {},
        discountSize?: {}, hide?: {}} = {};
    if (name) {
        where.name = {
            [Op.iLike]: `%${name}%`
        }
    }
    if (description) {
        where.description = {
            [Op.iLike]: `%${description}%`
        }
    }
    if (price) {
        where.price = price
    }
    if (discount) {
        where.discount = discount

        if (discountFrom && discountTo && discountSize) {
            where.discountFrom = discountFrom;
            where.discountTo = discountTo;
            where.discountSize = discountSize;
        }
    }
    where.hide = hide;

    return Item.findAll({where});
}
const getItemsByGenre = async (genreId: number) => {
    return Item.findAll({
        include: [{
            model: Genre,
            where: {id: genreId}
        }]
    });
}
const getItemsByCompany = async (companyId: number) => {
    return Item.findAll({
        include: [{
            model: Company,
            where: {id: companyId}
        }]
    });
}
const getItemsByGenreAndCompany = async (genreId: number, companyId: number) => {
    return Item.findAll({
        include: [{
            model: Genre,
            where: {id: genreId}
        }, {
            model: Company,
            where: {id: companyId}
        }]
    });
}
const getDiscountItems = async (date = Date.now()) => {
    return Item.findAll({
        where: {
            discount: true,
            discountFrom: {
                [Op.lte]: date
            },
            discountTo: {
                [Op.gte]: date
            }
        }
    });
}

export default Item;
export {
    Item,
    getItems,
    getItemsByGenre,
    getItemsByCompany,
    getItemsByGenreAndCompany,
    getDiscountItems
}