const sequelize = require('../db');
import {DataTypes, Op} from 'sequelize';

const PublicationComment = sequelize.define('publication_comment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    content: {type: DataTypes.TEXT, allowNull: false},
    rate: {type: DataTypes.INTEGER, allowNull: false},
    hide: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    violation: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    violation_reason: {type: DataTypes.TEXT, allowNull: true},
});
const getPublicationComments = async (publicationId?: number, content?: string, rate?: number,
                                      hide = false, violation = false,
                                      violationReason?: string) => {
    let where: {publicationId?: {}, content?: {}, rate?: {}, hide?: {},
                violation?: {}, violationReason?: {}} = {};

    if (publicationId) {
        where.publicationId = publicationId;
    }
    if (content) {
        where.content = {
            [Op.like]: `%${content}%`
        };
    }
    if (rate) {
        where.rate = rate;
    }
    where.hide = hide;
    where.violation = violation;
    if (violation && violationReason) {
        where.violationReason = {
            [Op.like]: `%${violationReason}%`
        };
    }

    return PublicationComment.findAll({where});
}

export default PublicationComment;
export {
    PublicationComment,
    getPublicationComments
}