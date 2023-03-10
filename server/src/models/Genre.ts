import Item from "./Item";

const sequelize = require('../db');
import {DataTypes, Op} from 'sequelize';

const Genre = sequelize.define('genre', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true},
    hide: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
}, {
    paranoid: true,
});

const _whereHandler = (includeHidden: boolean, name?: string, description?: string) => {
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
    where.hide = includeHidden;

    return where;
}
const _includeHandler = (includeItems: boolean, includeHidden: boolean) => {
    let include: any[] = [];
    if (includeItems) {
        include.push({
            model: Item,
            as: 'Items',
            attributes: ['id', 'name', 'description', 'image', 'releaseDate'],
            where: includeHidden ? {} : {hide: false}
        });
    }

    return include;
}
const getGenres = async (name?: string, description?: string,
                         descending = false, limit = 10, page = 0, sortBy = 'id',
                         includeItems = false, includeHidden = false) => {
    const where   = _whereHandler(includeHidden, name, description);
    const include = _includeHandler(includeItems, includeHidden);

    return Genre.findAll({
        where, limit, offset: page * limit, order: [[sortBy, descending ? 'DESC' : 'ASC']], include
    });
}
const getGenre = async (id: number, includeItems = true, includeHidden = false) => {
    const include = _includeHandler(includeItems, includeHidden);
    return Genre.findByPk(id, {include});
}

export default Genre;
export {
    Genre,
    getGenres,
    getGenre
}