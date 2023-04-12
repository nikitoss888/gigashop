import Item from "./Item";

const {sequelize_db} = require('../db');
import {DataTypes, Op} from 'sequelize';

const Company = sequelize_db.define('company', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
    },
    director: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {args: [2, 20], msg: 'Поле "Директор" повинно бути довжиною від 2 до 20 символів'},
            is: {args: /^([A-Z][a-zA-Z\-']+ ?)*$|^([А-ЯЄЇІҐ][а-яА-ЯЄєЇїІіҐґ\-']+ ?)*$/,
                msg: 'Поле "Директор" повинно містити лише літери'}
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'default.jpg'
    },
    founded: {
        type: DataTypes.DATE,
        allowNull: false
    },
    hide: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    paranoid: true,
});

const _whereHandler = (name?: string, description?: string,
                            director?: string, founded?: Date, includeHidden?: boolean) => {
    let where: {name?: {}, description?: {}, director?: {}, founded?: {}, hide?: {}} = {};
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
    if (director) {
        where.director = {
            [Op.iLike]: `%${director}%`
        }
    }
    if (founded) {
        where.founded = founded;
    }
    where.hide = includeHidden;

    return where;
}
const _includeHandler = (includeItemsDeveloped: boolean, includeItemsPublished: boolean, includeHidden: boolean) => {
    let include: any[] = [];

    if (includeItemsDeveloped) {
        include.push({
            model: Item,
            as: 'ItemsDeveloped',
            attributes: ['id', 'name', 'mainImage', 'releaseDate'],
            through: {attributes: []},
            where: includeHidden ? {} : {hide: false}
        });
    }
    if (includeItemsPublished) {
        include.push({
            model: Item,
            as: 'ItemsPublished',
            attributes: ['id', 'name', 'mainImage', 'releaseDate'],
            where: includeHidden ? {} : {hide: false}
        });
    }

    return include;
}
const getCompanies = async (name?: string, description?: string,
                            director?: string, founded?: Date,
                            descending = false, limit = 10, page = 0, sortBy = 'id',
                            includeItemsDeveloped = false,
                            includeItemsPublished = false, includeHidden = false) => {
    const where   = _whereHandler(name, description, director, founded, includeHidden);
    const include = _includeHandler(includeItemsDeveloped, includeItemsPublished, includeHidden);

    return Company.findAll({
        where, limit, offset: page * limit, order: [[sortBy, descending ? 'DESC' : 'ASC']], include
    });
};

const getCompany = async (id: number, includeItemsDeveloped = true,
                            includeItemsPublished = true, includeHidden = false) => {
    const include = _includeHandler(includeItemsDeveloped, includeItemsPublished, includeHidden);
    return Company.findByPk(id, {include});
}

export default Company;
export {
    Company,
    getCompanies,
    getCompany
};