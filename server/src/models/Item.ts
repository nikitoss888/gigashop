import {Company, Genre, User, Tag} from "./index";
import {DataTypes, Op} from 'sequelize';
import ApiError from "../errors/ApiError";
const sequelize = require('../db');

const Item = sequelize.define('item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT},
    releaseDate: {type: DataTypes.DATE, allowNull: false},
    price: {type: DataTypes.FLOAT, allowNull: false},
    amount: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: {min: 0}},
    discount: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    discountFrom: {type: DataTypes.DATE, allowNull: true},
    discountTo: {type: DataTypes.DATE, allowNull: true},
    discountSize: {type: DataTypes.FLOAT, allowNull: true},
    mainImage: {type: DataTypes.STRING, allowNull: false, defaultValue: 'default_item.jpg'},
    images: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: []},
    characteristics: {type: DataTypes.JSON, allowNull: false, defaultValue: {}},
    hide: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
}, {
    paranoid: true,
});

const _whereHandler = (name?: string, description?: string,
                       releaseDate?: Date, releaseDateFrom?: Date, releaseDateTo?: Date,
                       price?: number, priceFrom?: number, priceTo?: number,
                       amount?: number, amountFrom?: number, amountTo?: number,
                       discount?: boolean, discountFrom?: Date, discountTo?: Date,
                       discountSize?: number, discountSizeFrom?: number, discountSizeTo?: number,
                       hide = true) => {
    let where: {name?: {}, description?: {}, releaseDate?: {}, releaseDateFrom?: {}, releaseDateTo?: {},
        price?: {}, discount?: {}, discountFrom?: {}, discountTo?: {},
        amount?: {}, amountFrom?: {}, amountTo?: {},
        discountSize?: {}, company_publisherId?: {}, hide?: boolean} = {};

    if (name) {
        where.name = {
            [Op.iLike]: `%${name}%`
        }
    }
    if (description) {
        where.description = {
            [Op.iLike]: `%${description}%`
        }
    }

    if (releaseDate) {
        where.releaseDate = releaseDate;
    }
    if (releaseDateFrom) {
        where.releaseDate = {
            ...where.releaseDate,
            [Op.gte]: releaseDateFrom
        };
    }
    if (releaseDateTo) {
        where.releaseDate = {
            ...where.releaseDate,
            [Op.lte]: releaseDateTo
        };
    }

    if (price) {
        if (price < 0) throw ApiError.badRequest('???????? ???? ???????? ???????? ???????????? ???? 0');
        where.price = {
            [Op.eq]: price
        }
    }
    if (priceFrom) {
        if (priceFrom < 0) throw ApiError.badRequest('???????? ???? ???????? ???????? ???????????? ???? 0');
        where.price = {
            ...where.price,
            [Op.gte]: priceFrom
        };
    }
    if (priceTo) {
        if (priceTo < 0) throw ApiError.badRequest('???????? ???? ???????? ???????? ???????????? ???? 0');
        where.price = {
            ...where.price,
            [Op.lte]: priceTo
        };
    }

    if (amount) {
        if (amount < 0) throw ApiError.badRequest('?????????????????? ???? ???????? ???????? ???????????? ???? 0');
        where.amount = amount;
    }
    if (amountFrom) {
        if (amountFrom < 0) throw ApiError.badRequest('?????????????????? ???? ???????? ???????? ???????????? ???? 0');
        where.amount = {
            ...where.amount,
            [Op.gte]: amountFrom
        };
    }
    if (amountTo) {
        if (amountTo < 0) throw ApiError.badRequest('?????????????????? ???? ???????? ???????? ???????????? ???? 0');
        where.amount = {
            ...where.amount,
            [Op.lte]: amountTo
        };
    }

    if (discount !== undefined) {
        where.discount = discount
    }
    if (discountFrom) {
        where.discountFrom = {
            [Op.gte]: discountFrom
        };
    }
    if (discountTo) {
        where.discountTo = {
            [Op.lte]: discountTo
        };
    }

    if (discountSize) {
        if (discountSize < 0 || discountSize > 100)
            throw ApiError.badRequest('???????????? ???????????? ???? ???????? ???????? ???????????? ???? 0 ?????? ?????????????? ???? 100');
        where.discountSize = discountSize;
    }
    if (discountSizeFrom) {
        if (discountSizeFrom < 0 || discountSizeFrom > 100)
            throw ApiError.badRequest('???????????? ???????????? ???? ???????? ???????? ???????????? ???? 0 ?????? ?????????????? ???? 100');
        where.discountSize = {
            ...where.discountSize,
            [Op.gte]: discountSizeFrom
        };
    }
    if (discountSizeTo) {
        if (discountSizeTo < 0 || discountSizeTo > 100)
            throw ApiError.badRequest('???????????? ???????????? ???? ???????? ???????? ???????????? ???? 0 ?????? ?????????????? ???? 100');
        where.discountSize = {
            ...where.discountSize,
            [Op.lte]: discountSizeTo
        };
    }

    where.hide = hide;

    return where;
}
let _includeHandler = (includePublisher: boolean, includeGenres: boolean, includeDevelopers: boolean,
                       includeWishlisted: boolean, includeInCart: boolean, includeBought: boolean,
                       includeRated: boolean, includeTags: boolean, includeHidden: boolean,
                       publisherId?: number, genresId?: number[], developersId?: number[]) => {
    let include: {}[] = [];

    if (includePublisher) {
        let where = {};

        if (!includeHidden) {
            where = {
                hide: false
            }
        }
        if (publisherId) {
            where = {
                ...where,
                id: publisherId
            }
        }

        include.push({
            model: Company,
            as: 'Publisher',
            attributes: ['id', 'name'],
            where,
            required: !!publisherId
        });
    }

    if (includeGenres) {
        let where = {};
        let required = false;

        if (!includeHidden) {
            where = {
                hide: false
            }
        }
        if (genresId) {
            where = {
                ...where,
                id: {[Op.in]: genresId}
            }
            required = genresId.length > 0
        }

        include.push({
            model: Genre,
            as: 'Genres',
            attributes: ['id', 'name'],
            where,
            required
        });
    }

    if (includeDevelopers) {
        let where = {};
        let required = false;

        if (!includeHidden) {
            where = {
                hide: false
            }
        }
        if (developersId) {
            where = {
                id: {[Op.in]: developersId}
            }
            required = developersId.length > 0
        }

        include.push({
            model: Company,
            as: 'Developers',
            attributes: ['id', 'name'],
            where: where,
            required
        });
    }

    if (includeWishlisted) {
        include.push({
            model: User,
            as: 'WishlistedUsers',
            attributes: ['id', 'email', 'login'],
            required: false
        });
    }

    if (includeInCart) {
        include.push({
            model: User,
            as: 'CartedUsers',
            attributes: ['id', 'email', 'login'],
            required: false
        });
    }

    if (includeBought) {
        include.push({
            model: User,
            as: 'BoughtUsers',
            attributes: ['id', 'email', 'login'],
            required: false
        });
    }

    if (includeRated) {
        include.push({
            model: User,
            as: 'RatedUsers',
            attributes: ['id', 'email', 'login'],
            required: false
        });
    }

    if (includeTags) {
        include.push({
            model: Tag,
            as: 'Tags',
            through: { attributes: [] },
            attributes: ['id', 'name', [sequelize.fn('COUNT', sequelize.col('Tags.id')), 'count']],
            group: ['Tags.id'],
            required: false
        });
    }

    return include;
}

const getItems = async (name?: string, description?: string,
                        releaseDate?: Date, releaseDateFrom?: Date, releaseDateTo?: Date,
                        price?: number, priceFrom?: number, priceTo?: number,
                        amount?: number, amountFrom?: number, amountTo?: number,
                        discount?: boolean, discountFrom?: Date, discountTo?: Date,
                        discountSize?: number, discountSizeFrom?: number, discountSizeTo?: number,
                        descending = false, limit = 10, page = 0, sortBy = 'id',
                        includePublisher = true, publisherId?: number,
                        includeGenres = true, genresId?: number[],
                        includeDevelopers = true, developersId?: number[],
                        includeWishlisted = false, includeInCart = false,
                        includeBought = false, includeRated = false,
                        includeTags = true, includeHidden = false) => {
    const where   = _whereHandler(name, description, releaseDate, releaseDateFrom, releaseDateTo,
        price, priceFrom, priceTo, amount, amountFrom, amountTo,
        discount, discountFrom, discountTo, discountSize, discountSizeFrom, discountSizeTo, includeHidden)
    const include = _includeHandler(includePublisher, includeGenres, includeDevelopers,
        includeWishlisted, includeInCart, includeBought, includeRated, includeTags, includeHidden,
        publisherId, genresId, developersId);

    return Item.findAll({
        where, limit, offset: limit * page, order: [[sortBy, descending ? 'DESC' : 'ASC']], include
    });
}

const getItem = async (id: number, includePublisher = true, includeGenres = true,
                       includeDevelopers = true, includeWishlisted = false, includeInCart = false,
                       includeBought = false, includeRated = false,
                       includeTags = true, includeHidden = false) => {
    const include = _includeHandler(includePublisher, includeGenres, includeDevelopers,
        includeWishlisted, includeInCart, includeBought, includeRated, includeTags, includeHidden);

    return Item.findByPk(id, {include});
}


const getDiscountItems = async () => {
    const date = Date.now();
    return Item.findAll({
        where: {
            discount: true,
            discountFrom: {
                [Op.lte]: date
            },
            discountTo: {
                [Op.gte]: date
            }
        }
    });
}

export default Item;
export {
    Item,
    getItems,
    getItem,
    getDiscountItems
}