import Item from "./Item";

const {sequelize_db} = require('../db');
import {DataTypes, Op} from 'sequelize';

const Genre = sequelize_db.define('genre', {
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
        allowNull: true
    },
    hide: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
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
    if (!includeHidden) {
        where.hide = false;
    }

    return where;
}
const _includeHandler = (includeItems: boolean, includeHidden: boolean) => {
    let include: {}[] = [];
    const where: {hide?: {}} = {};
    if (!includeHidden) {
        where.hide = false;
    }

    if (includeItems) {
        include.push({
            model: Item,
            as: 'Items',
            through: {attributes: []},
            where,
            required: false
        });
    }

    return include;
}
type getAllGenresParams = {
    name?: string,
    description?: string,
    descending?: boolean,
    limit?: number,
    page?: number,
    sortBy?: string,
    includeItems?: boolean,
    includeHidden?: boolean
}
const getGenres = async ({name, description, descending = false, limit = 10, page = 0, sortBy = 'name', includeItems = false, includeHidden = false}: getAllGenresParams) => {
    const where   = _whereHandler(includeHidden, name, description);
    const include = _includeHandler(includeItems, includeHidden);
    const totalCount = await Genre.count({ where: includeHidden ? {} : { hide: false } } );
    const genres = await Genre.findAll({
        where, limit, offset: page * limit, order: [[sortBy, descending ? "DESC" : "ASC"]], include
    });

    return {
        genres,
        totalCount,
    };
}
type getOneGenreParams = {
    id: number | string,
    includeItems?: boolean,
    includeHidden?: boolean
}
const getGenre = async ({id, includeItems = true, includeHidden = false}: getOneGenreParams) => {
    const where: {id: number | string, hide?: boolean}   = {id};
    if (!includeHidden) {
        where.hide = false;
    }

    const include = _includeHandler(includeItems, includeHidden);
    return Genre.findOne({ where, include });
}

export default Genre;
export {
    Genre,
    getGenres,
    getGenre
}