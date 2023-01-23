const sequelize = require('../db');
import {DataTypes} from 'sequelize';

module.exports = sequelize.define('item_characteristic', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    key: {type: DataTypes.STRING, allowNull: false},
    value: {type: DataTypes.STRING, allowNull: false},
});