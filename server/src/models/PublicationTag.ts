const sequelize = require('../db');
import {DataTypes} from 'sequelize';

const PublicationTag = sequelize.define('publication_tag', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

export default PublicationTag;
export {
    PublicationTag
}