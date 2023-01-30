const sequelize = require('../db');
import {DataTypes} from 'sequelize';

const ItemFavorite = sequelize.define('item_favorite', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});
const getItemsFavorite = async (userId?: number, itemId?: number) => {
    let where: {userId?: {}, itemId?: {}} = {};

    if (userId) {
        where.userId = userId;
    }
    if (itemId) {
        where.itemId = itemId;
    }

    return ItemFavorite.findAll({where});
}

export default ItemFavorite;
export {
    ItemFavorite,
    getItemsFavorite
}