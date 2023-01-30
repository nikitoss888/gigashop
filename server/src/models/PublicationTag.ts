const sequelize = require('../db');
import {DataTypes, Op} from 'sequelize';

const PublicationTag = sequelize.define('publication_tag', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
});
const getPublicationTags = async (publicationId?: number, name?: string) => {
    let where: {publicationId?: {}, name?: {}} = {};

    if (publicationId) {
        where.publicationId = publicationId;
    }
    if (name) {
        where.name = {
            [Op.like]: `%${name}%`
        }
    }

    return PublicationTag.findAll({where});
}

export default PublicationTag;
export {
    PublicationTag,
    getPublicationTags
}