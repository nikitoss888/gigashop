const sequelize = require('../db');
import {DataTypes} from 'sequelize';

module.exports = sequelize.define('publication_comment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    content: {type: DataTypes.TEXT, allowNull: false},
    rate: {type: DataTypes.INTEGER, allowNull: false},
    hide: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    violation: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    violation_reason: {type: DataTypes.TEXT, allowNull: true},
});