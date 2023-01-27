const sequelize_db = require('../db');
import {DataTypes} from 'sequelize';

module.exports = sequelize_db.define('company', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT},
    director: {type: DataTypes.STRING, allowNull: false},
    image: {type: DataTypes.STRING, allowNull: false, defaultValue: 'default_company.jpg'},
    foundedYear: {type: DataTypes.DATE, allowNull: false},
    hide: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
});