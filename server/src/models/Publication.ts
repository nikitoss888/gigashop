const sequelize = require('../db');
import {DataTypes, Op} from 'sequelize';

const Publication = sequelize.define('publication', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    content: {type: DataTypes.TEXT, allowNull: false},
    hide: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    violation: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    violation_reason: {type: DataTypes.TEXT, allowNull: true},
});
const getPublications = async (title?: string, content?: string, hide = false,
                               violation = false, violationReason?: string) => {
    let where: {title?: {}, content?: {}, hide?: {}, violation?: {}, violationReason?: {}} = {};

    if (title) {
        where.title = {
            [Op.like]: `%${title}%`
        };
    }
    if (content) {
        where.content = {
            [Op.like]: `%${content}%`
        };
    }
    where.hide = hide;
    where.violation = violation;
    if (violation && violationReason) {
        where.violationReason = {
            [Op.like]: `%${violationReason}%`
        };
    }

    return Publication.findAll({where});
}

export default Publication;
export {
    Publication,
    getPublications
}