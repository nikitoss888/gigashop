const {sequelize_db} = require('../db');
import {DataTypes} from 'sequelize';

const Wishlist = sequelize_db.define('item_favorite', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});
const getWishlists = async (userId?: number | number[], itemId?: number | number[]) => {
    let where: {userId?: {}, itemId?: {}} = {};

    if (userId) {
        where.userId = userId;
    }
    if (itemId) {
        where.itemId = itemId;
    }

    return Wishlist.findAll({where});
}

export default Wishlist;
export {
    Wishlist,
    getWishlists
}