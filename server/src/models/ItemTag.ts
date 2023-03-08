const sequelize = require('../db');
import {DataTypes} from 'sequelize';

const ItemTag = sequelize.define('item_tag', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

export default ItemTag;
export {
    ItemTag
}