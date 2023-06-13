const {sequelize_db} = require('../db');
import {DataTypes} from 'sequelize';

const ItemCart = sequelize_db.define('item_cart', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    transactionId: {type: DataTypes.STRING, allowNull: true},
});
const getCarts = async (userId?: number, itemId?: number) => {
    let where: {userId?: {}, itemId?: {}} = {};

    if (userId) {
        where.userId = userId;
    }
    if (itemId) {
        where.itemId = itemId;
    }

    return ItemCart.findAll({where});
}

export default ItemCart;
export {
    ItemCart,
    getCarts
}