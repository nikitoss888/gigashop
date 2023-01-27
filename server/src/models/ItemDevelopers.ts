const sequelize = require('../db');
import {DataTypes} from 'sequelize';

module.exports = sequelize.define('item_developers', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});