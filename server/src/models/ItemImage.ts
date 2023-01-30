const sequelize = require('../db');
import {DataTypes, Op} from 'sequelize';

const ItemImage = sequelize.define('item_image', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    src: {type: DataTypes.STRING, allowNull: false},
});
const getItemImages = async (itemId?: number, name?: string, src?: string) => {
    let where: {itemId?: {}, name?: {}, src?: {}} = {};

    if (itemId) {
        where.itemId = itemId;
    }
    if (name) {
        where.name = {
            [Op.like]: `%${name}%`
        };
    }
    if (src) {
        where.src = {
            [Op.like]: `%${src}%`
        };
    }

    return ItemImage.findAll({where});
}

export default ItemImage;
export {
    ItemImage,
    getItemImages
}