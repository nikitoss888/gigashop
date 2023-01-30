const sequelize = require('../db');
import {DataTypes, Op} from 'sequelize';

const Genre = sequelize.define('genre', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true},
    hide: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
});
const getGenres = async (name?: string, description?: string, hide = false) => {
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

    return Genre.findAll({where});
}

export default Genre;
export {
    Genre,
    getGenres
}