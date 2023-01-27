const sequelize = require('../db');
import {DataTypes} from 'sequelize';

module.exports = sequelize.define('item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT},
    price: {type: DataTypes.FLOAT, allowNull: false},
    discount: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    discountFrom: {type: DataTypes.DATE, allowNull: true},
    discountTo: {type: DataTypes.DATE, allowNull: true},
    discountSize: {type: DataTypes.FLOAT, allowNull: true},
    image: {type: DataTypes.STRING, allowNull: false, defaultValue: 'default_item.jpg'},
    hide: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
});