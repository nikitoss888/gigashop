import ApiError from "../errors/ApiError";

const {sequelize_db} = require('../db');
import {DataTypes, Op} from 'sequelize';

const ItemRate = sequelize_db.define('item_rate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    rate: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hide: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    violation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    violation_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
});
type getAllItemRatesParams = {
    itemId?: number,
    content?: string,
    rate?: number,
    rateFrom?: number,
    rateTo?: number,
    hide?: boolean,
    violation?: boolean,
    violationReason?: string
}
const getItemRates = async ({itemId, content, rate, rateFrom, rateTo, hide, violation, violationReason}: getAllItemRatesParams) => {
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

type getAllRatesParams = {
    descending?: boolean,
    limit?: number,
    page?: number,
    sortBy?: string,
}
export const getAllRates = async ({descending = true, limit = 12, page = 1, sortBy = "createdAt"}: getAllRatesParams) => {
    if (page < 1) throw ApiError.badRequest('Сторінка повинна бути більша за 0');
    if (limit < 1) throw ApiError.badRequest('Ліміт повинен бути більший за 0');

    const totalCount = await ItemRate.count();
    const rates = await ItemRate.findAll({order: [[sortBy, descending ? 'DESC' : 'ASC']], limit, offset: (page - 1) * limit - limit});

    return {
        totalCount,
        rates,
    }
};

export default ItemRate;
export {
    ItemRate,
    getItemRates
}