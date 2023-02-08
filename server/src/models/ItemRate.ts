import ApiError from "../errors/ApiError";

const sequelize = require('../db');
import {DataTypes, Op} from 'sequelize';

const ItemRate = sequelize.define('item_rate', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    content: {type: DataTypes.TEXT, allowNull: true},
    rate: {type: DataTypes.INTEGER, allowNull: false},
    hide: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    violation: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    violation_reason: {type: DataTypes.TEXT, allowNull: true},
});
const getItemRates = async (itemId?: number, content?: string, rate?: number, rateFrom?: number, rateTo?: number,
                            hide = false, violation = false, violationReason?: string) => {
    let where: {itemId?: {}, content?: {}, rate?: {}, hide?: {}, violation?: {}, violationReason?: {}} = {};

    if (itemId) {
        where.itemId = itemId;
    }
    if (content) {
        where.content = {
            [Op.like]: `%${content}%`
        };
    }
    if (rate) {
        if (rate < 1 || rate > 5) throw ApiError.badRequest('Оцінка повинна бути від 1 до 5');
        where.rate = rate;
    }
    if (rateFrom) {
        if (rateFrom < 1 || rateFrom > 5) throw ApiError.badRequest('Оцінка повинна бути від 1 до 5');
        where.rate = {
            ...where.rate,
            [Op.gte]: rateFrom
        };
    }
    if (rateTo) {
        if (rateTo < 1 || rateTo > 5) throw ApiError.badRequest('Оцінка повинна бути від 1 до 5');
        where.rate = {
            ...where.rate,
            [Op.lte]: rateTo
        };
    }
    where.hide = hide;
    where.violation = violation;
    if (violation && violationReason) {
        where.violationReason = {
            [Op.like]: `%${violationReason}%`
        };
    }

    return ItemRate.findAll({where});
}

export default ItemRate;
export {
    ItemRate,
    getItemRates
}