import Item from "./Item";

const sequelize_db = require('../db');
import {DataTypes, Op} from 'sequelize';

const Company = sequelize_db.define('company', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT},
    director: {type: DataTypes.STRING, allowNull: false},
    image: {type: DataTypes.STRING, allowNull: false, defaultValue: 'default_company.jpg'},
    founded: {type: DataTypes.DATEONLY, allowNull: false},
    hide: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
});
const getCompanies = async (name?: string, description?: string,
                            director?: string, founded?: Date,
                            descending = false, limit = 10, page = 0, sortBy = 'id',
                            includeItemsDeveloped = false,
                            includeItemsPublished = false, hide = false) => {
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
    where.hide = hide;

    let include: any[] = [];
    if (includeItemsDeveloped) {
        include.push({
            model: Item,
            as: 'ItemsDeveloped'
        });
    }
    if (includeItemsPublished) {
        include.push({
            model: Item,
            as: 'ItemsPublished',
            attributes: ['id', 'name', 'description', 'image', 'releaseDate', 'hide']
        });
    }

    return Company.findAll({
        where, limit, offset: page * limit, order: [[sortBy, descending ? 'DESC' : 'ASC']], include
    });
};

export default Company;
export {
    Company,
    getCompanies
};