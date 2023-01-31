import {Company, Genre} from "./index";

const sequelize = require('../db');
import {DataTypes, Op} from 'sequelize';

const Item = sequelize.define('item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT},
    releaseDate: {type: DataTypes.DATE, allowNull: false},
    price: {type: DataTypes.FLOAT, allowNull: false},
    discount: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    discountFrom: {type: DataTypes.DATE, allowNull: true},
    discountTo: {type: DataTypes.DATE, allowNull: true},
    discountSize: {type: DataTypes.FLOAT, allowNull: true},
    mainImage: {type: DataTypes.STRING, allowNull: false, defaultValue: 'default_item.jpg'},
    images: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: []},
    characteristics: {type: DataTypes.JSON, allowNull: false, defaultValue: {}},
    hide: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
});
const getItems = async (name?: string, description?: string, price?: number, discount?: boolean,
                        discountFrom?: Date, discountTo?: Date, discountSize?: number, publisherId?: number,
                        priceFrom?: number, priceTo?: number, hide = false,
                        descending = false, limit = 10, offset = 0) => {
    let where: {name?: {}, description?: {}, price?: {}, discount?: {}, discountFrom?: {}, discountTo?: {},
        discountSize?: {}, publisherId?: {}, hide?: boolean} = {};
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
        where.price = {
            [Op.eq]: price
        }
    }
    if (priceFrom) {
        where.price = {
            ...where.price,
            [Op.gte]: priceFrom
        };
    }
    if (priceTo) {
        where.price = {
            ...where.price,
            [Op.lte]: priceTo
        };
    }
    if (discount !== undefined) {
        where.discount = discount
    }
    if (discountFrom) {
        where.discountFrom = {
            [Op.gte]: discountFrom
        };
    }
    if (discountTo) {
        where.discountTo = {
            [Op.lte]: discountTo
        };
    }
    if (discountSize) {
        where.discountSize = discountSize;
    }
    if (publisherId) {
        where.publisherId = publisherId;
    }
    where.hide = hide;

    return Item.findAll({where, limit, offset, order: [['id', descending ? 'DESC' : 'ASC']]});
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