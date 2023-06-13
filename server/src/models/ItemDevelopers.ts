const {sequelize_db} = require('../db');
import {DataTypes} from 'sequelize';

const ItemDevelopers = sequelize_db.define('item_developer', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});
const getItemDevelopers = async (itemId?: number, developerId?: number) => {
    let where: {itemId?: {}, developerId?: {}} = {};

    if (itemId) {
        where.itemId = itemId;
    }
    if (developerId) {
        where.developerId = developerId;
    }

    return ItemDevelopers.findAll({where});
}

export default ItemDevelopers;
export {
    ItemDevelopers,
    getItemDevelopers
}