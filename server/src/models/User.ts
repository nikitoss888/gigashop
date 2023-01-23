const sequelize = require('../db');
import {DataTypes} from 'sequelize';

module.exports = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true, allowNull: false},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    firstName: {type: DataTypes.STRING, allowNull: false},
    lastName: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: 'USER', allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    isDeleted: {type: DataTypes.BOOLEAN, defaultValue: false},
    isBanned: {type: DataTypes.BOOLEAN, defaultValue: false},
});