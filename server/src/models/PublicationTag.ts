const sequelize = require('../db');
import {DataTypes} from 'sequelize';

module.exports = sequelize.define('publication_tag', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
});