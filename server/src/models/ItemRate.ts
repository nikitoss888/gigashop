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
const getItemRates = async (itemId?: number, content?: string, rate?: number,
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
        where.rate = rate;
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