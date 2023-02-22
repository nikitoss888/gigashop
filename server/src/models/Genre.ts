import Item from "./Item";

const sequelize = require('../db');
import {DataTypes, Op} from 'sequelize';

const Genre = sequelize.define('genre', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true},
    hide: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
});
const getGenres = async (name?: string, description?: string,
                         descending = false, limit = 10, page = 0, sortBy = 'id',
                         includeItems = false, hide = false) => {
    let where: {name?: {}, description?: {}, hide?: {}} = {};
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
    where.hide = hide;

    let include: any[] = [];
    if (includeItems) {
        include.push({
            model: Item,
            as: 'Items',
            attributes: ['id', 'name', 'description', 'image', 'releaseDate', 'hide']
        });
    }

    return Genre.findAll({
        where, limit, offset: page * limit, order: [[sortBy, descending ? 'DESC' : 'ASC']], include
    });
}

export default Genre;
export {
    Genre,
    getGenres
}