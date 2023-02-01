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
const getPublications = async (title?: string, content?: string,
                               createdAt?: Date, createdFrom?: Date, createdTo?: Date,
                               descending = false, limit = 10, page = 0, sortBy = 'id',
                               hide = false, violation = false, violationReason?: string) => {
    let where: {title?: {}, content?: {}, hide?: {}, violation?: {}, violationReason?: {}, createdAt?: {}} = {};

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
    if (createdAt) {
        where.createdAt = createdAt;
    }
    if (createdFrom) {
        where.createdAt = {
            ...where.createdAt,
            [Op.gte]: createdFrom
        };
    }
    if (createdTo) {
        where.createdAt = {
            ...where.createdAt,
            [Op.lte]: createdTo
        };
    }

    return Publication.findAll({where, limit, offset: page * limit, order: [[sortBy, descending ? 'DESC' : 'ASC']]});
}

export default Publication;
export {
    Publication,
    getPublications
}