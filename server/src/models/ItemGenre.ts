const sequelize = require('../db');
import {DataTypes} from 'sequelize';

const ItemGenre = sequelize.define('item_genre', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});
const getItemGenres = async (itemId?: number, genreId?: number) => {
    let where: {itemId?: {}, genreId?: {}} = {};

    if (itemId) {
        where.itemId = itemId;
    }
    if (genreId) {
        where.genreId = genreId;
    }

    return ItemGenre.findAll({where});
}

export default ItemGenre;
export {
    ItemGenre,
    getItemGenres
}