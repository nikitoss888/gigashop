const sequelize = require('../db');
import {DataTypes} from 'sequelize';

const ItemCharacteristic = sequelize.define('item_characteristics', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    key: {type: DataTypes.STRING, allowNull: false},
    value: {type: DataTypes.STRING, allowNull: false},
});
const getItemCharacteristics = async (itemId?: number, key?: string, value?: string) => {
    let where: {itemId?: {}, key?: {}, value?: {}} = {};

    if (itemId) {
        where.itemId = itemId;
    }
    if (key) {
        where.key = key;
    }
    if (value) {
        where.value = value;
    }

    return ItemCharacteristic.findAll({where});
}

export default ItemCharacteristic;
export {
    ItemCharacteristic,
    getItemCharacteristics
}