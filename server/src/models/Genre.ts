const sequelize = require('../db');
import {DataTypes} from 'sequelize';

module.exports = sequelize.define('genre', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true},
    hide: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
});