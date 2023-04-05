const {sequelize_db} = require('../db');
import {DataTypes} from 'sequelize';

const ItemBought = sequelize_db.define('item_bought', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
}, {
    paranoid: true,
});
const getItemsBought = async (userId?: number, itemId?: number) => {
    let where: {userId?: {}, itemId?: {}} = {};

    if (userId) {
        where.userId = userId;
    }
    if (itemId) {
        where.itemId = itemId;
    }

    return ItemBought.findAll({where});
}

export default ItemBought;
export {
    ItemBought,
    getItemsBought
}