const sequelize = require('../db');
import {DataTypes} from 'sequelize';

module.exports = sequelize.define('item_image', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    src: {type: DataTypes.STRING, allowNull: false},
});