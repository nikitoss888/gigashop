const {sequelize_db} = require('../db');
import {DataTypes} from 'sequelize';

const PublicationTag = sequelize_db.define('publication_tag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

export default PublicationTag;
export {
    PublicationTag
}