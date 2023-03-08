import {Publication, Item} from "./index";
const sequelize = require('../db');
import {DataTypes, Op} from 'sequelize';

const Tag = sequelize.define('tag', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
}, {
    paranoid: true,
});
const getTags = async (name?: string) => {
    let where: {name?: {}} = {};

    if (name) {
        where.name = {
            [Op.like]: `%${name}%`
        }
    }

    return Tag.findAll({where});
}

const getTagsOfPublication = async (publicationId: number, name?: string) => {
    let where: {name?: {}} = {};

    if (name) {
        where.name = {
            [Op.like]: `%${name}%`
        }
    }

    return Tag.findAll({
        include: [{
            model: Publication,
            as: 'TaggedPublications',
            where: {
                id: publicationId
            },
            attributes: [],
        }],
        attributes: ['id', 'name', [sequelize.fn('COUNT', sequelize.col('TaggedPublications.id')), 'count']],
        where,
        group: ['Tag.id'],
    });
}

const getTagsOfItem = async (itemId: number, name?: string) => {
    let where: {name?: {}} = {};

    if (name) {
        where.name = {
            [Op.like]: `%${name}%`
        }
    }

    return Tag.findAll({
        include: [{
            model: Item,
            as: 'TaggedItems',
            where: {
                id: itemId
            },
            attributes: [],
        }],
        attributes: ['id', 'name', [sequelize.fn('COUNT', sequelize.col('TaggedItems.id')), 'count']],
        where,
        group: ['Tag.id'],
    });
}

export default Tag;
export {
    Tag,
    getTags,
    getTagsOfPublication,
    getTagsOfItem
}