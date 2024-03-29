import { Company, Genre, ItemRate, User } from "./index";
import {DataTypes, Op} from 'sequelize';
import ApiError from "../errors/ApiError";
const {sequelize_db} = require('../db');

const Item = sequelize_db.define('item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
    },
    releaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: {args: [0], msg: 'Поле "Кількість" повинно бути більше 0'}
        }
    },
    discount: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    discountFrom: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    discountTo: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    discountSize: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    mainImage: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'default.png'
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
    },
    coverImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    characteristics: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
    },
    hide: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    paranoid: true,
});

const _whereHandler = (name?: string, description?: string,
                       releaseDate?: Date, releaseDateFrom?: Date, releaseDateTo?: Date,
                       price?: number, priceFrom?: number, priceTo?: number,
                       amount?: number, amountFrom?: number, amountTo?: number,
                       discount?: boolean, discountFrom?: Date, discountTo?: Date,
                       discountSize?: number, discountSizeFrom?: number, discountSizeTo?: number,
                       hide = false) => {
    let where: {name?: {}, description?: {}, releaseDate?: {}, releaseDateFrom?: {}, releaseDateTo?: {},
        price?: {}, discount?: {}, discountFrom?: {}, discountTo?: {},
        amount?: {}, amountFrom?: {}, amountTo?: {},
        discountSize?: {}, company_publisherId?: {}, hide?: {}} = {};

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
        if (price < 0) throw ApiError.badRequest('Ціна не може бути меншою за 0');
        where.price = {
            [Op.eq]: price
        }
    }
    if (priceFrom) {
        if (priceFrom < 0) throw ApiError.badRequest('Ціна не може бути меншою за 0');
        where.price = {
            ...where.price,
            [Op.gte]: priceFrom
        };
    }
    if (priceTo) {
        if (priceTo < 0) throw ApiError.badRequest('Ціна не може бути меншою за 0');
        where.price = {
            ...where.price,
            [Op.lte]: priceTo
        };
    }

    if (amount) {
        if (amount < 0) throw ApiError.badRequest('Кількість не може бути меншою за 0');
        where.amount = amount;
    }
    if (amountFrom) {
        if (amountFrom < 0) throw ApiError.badRequest('Кількість не може бути меншою за 0');
        where.amount = {
            ...where.amount,
            [Op.gte]: amountFrom
        };
    }
    if (amountTo) {
        if (amountTo < 0) throw ApiError.badRequest('Кількість не може бути меншою за 0');
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
            throw ApiError.badRequest('Розмір знижки не може бути меншим за 0 або більшим за 100');
        where.discountSize = discountSize;
    }
    if (discountSizeFrom) {
        if (discountSizeFrom < 0 || discountSizeFrom > 100)
            throw ApiError.badRequest('Розмір знижки не може бути меншим за 0 або більшим за 100');
        where.discountSize = {
            ...where.discountSize,
            [Op.gte]: discountSizeFrom
        };
    }
    if (discountSizeTo) {
        if (discountSizeTo < 0 || discountSizeTo > 100)
            throw ApiError.badRequest('Розмір знижки не може бути меншим за 0 або більшим за 100');
        where.discountSize = {
            ...where.discountSize,
            [Op.lte]: discountSizeTo
        };
    }
    if (hide) {
        where.hide = {
            [Op.or]: [false, hide]
        };
    }
    console.log({ hide, whereHide: where.hide });

    return where;
}
let _includeHandler = (includePublisher: boolean, includeGenres: boolean, includeDevelopers: boolean,
                       includeWishlisted: boolean, includeInCart: boolean,
                       includeRated: boolean, includeHidden: boolean,
                       publisherId?: number, genresIds?: number[], developersIds?: number[]) => {
    let include: {}[] = [];

    if (includePublisher) {
        let where = {};

        if (includeHidden) {
            where = {
                hide: {
                    [Op.or]: [false, includeHidden]
                }
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
            where,
            required: !!publisherId
        });
    }

    if (includeGenres) {
        let where = {};
        let required = false;

        if (includeHidden) {
            where = {
                hide: {
                    [Op.or]: [false, includeHidden]
                }
            }
        }
        if (genresIds) {
            where = {
                ...where,
                id: {[Op.in]: genresIds}
            }
            required = genresIds.length > 0
        }

        include.push({
            model: Genre,
            as: 'Genres',
            where,
            through: {
                attributes: []
            },
            required
        });
    }

    if (includeDevelopers) {
        let where = {};
        let required = false;

        if (includeHidden) {
            where = {
                hide: {
                    [Op.or]: [false, includeHidden]
                }
            }
        }
        if (developersIds) {
            where = {
                ...where,
                id: {[Op.in]: developersIds}
            }
            required = developersIds.length > 0
        }

        include.push({
            model: Company,
            as: 'Developers',
            where,
            through: {
                attributes: []
            },
            required
        });
    }

    if (includeWishlisted) {
        include.push({
            model: User,
            attributes: {exclude: ['password']},
            as: 'WishlistedUsers',
            through: { attributes: [] },
            required: false
        });
    }

    if (includeInCart) {
        include.push({
            model: User,
            as: 'CartedUsers',
            attributes: {exclude: ['password']},
            through: {
                attributes: []
            },
            required: false
        });
    }

    if (includeRated) {
        let where = {};
        if (includeHidden) {
            where = {
                hide: {
                    [Op.or]: [false, includeHidden]
                },
                violation: {
                    [Op.or]: [false, includeHidden]
                }
            }
        }

        include.push({
            model: ItemRate,
            as: 'Rates',
            include: [{
                model: User,
                as: 'User',
                attributes: {exclude: ['password']},
            }],
            where,
            required: false
        });
    }

    return include;
}
type getAllItemsParams = {
    name?: string,
    description?: string,
    releaseDate?: Date,
    releaseDateFrom?: Date,
    releaseDateTo?: Date,
    price?: number,
    priceFrom?: number,
    priceTo?: number,
    amount?: number,
    amountFrom?: number,
    amountTo?: number,
    discount?: boolean,
    discountFrom?: Date,
    discountTo?: Date,
    discountSize?: number,
    discountSizeFrom?: number,
    discountSizeTo?: number,
    descending?: boolean,
    limit?: number,
    page?: number,
    sortBy?: string,
    includePublisher?: boolean,
    publisherId?: number,
    includeGenres?: boolean,
    genresIds?: number[],
    includeDevelopers?: boolean,
    developersIds?: number[],
    includeWishlisted?: boolean,
    includeInCart?: boolean,
    includeRated?: boolean,
    includeHidden?: boolean
}
const getItems = async ({name, description, releaseDate, releaseDateFrom, releaseDateTo,
                            price, priceFrom, priceTo, amount, amountFrom, amountTo,
                            discount, discountFrom, discountTo, discountSize, discountSizeFrom, discountSizeTo,
                            descending = false, limit = 10, page = 0, sortBy = 'id',
                            includePublisher = false, publisherId,
                            includeGenres = false, genresIds,
                            includeDevelopers = false, developersIds,
                            includeWishlisted = false, includeInCart = false,
                            includeRated = true, includeHidden = false}: getAllItemsParams) => {
    console.log({ includeHidden });
    const where   = _whereHandler(name, description, releaseDate, releaseDateFrom, releaseDateTo,
        price, priceFrom, priceTo, amount, amountFrom, amountTo,
        discount, discountFrom, discountTo, discountSize, discountSizeFrom, discountSizeTo, includeHidden)
    const include = _includeHandler(includePublisher, includeGenres, includeDevelopers,
        includeWishlisted, includeInCart, includeRated, includeHidden,
        publisherId, genresIds, developersIds);
    const totalCount = await Item.count({where: includeHidden ? {} : { hide: false }});
    const items = await Item.findAll({
        where, limit, offset: limit * page, order: [[sortBy, descending ? "DESC" : "ASC"]], include
    });

    return {
        items,
        totalCount,
    };
}
type getOneItemParams = {
    id: number,
    includePublisher?: boolean,
    includeGenres?: boolean,
    includeDevelopers?: boolean,
    includeWishlisted?: boolean,
    includeInCart?: boolean,
    includeRated?: boolean,
    includeHidden?: boolean
}
const getItem = async ({id, includePublisher = true, includeGenres = true, includeDevelopers = true,
                           includeWishlisted = false, includeInCart = false, includeRated = false, includeHidden = false}: getOneItemParams) => {
    const where = {
        id,
        hide: {
            [Op.or]: [includeHidden, false]
        }
    }

    const include = _includeHandler(includePublisher, includeGenres, includeDevelopers,
        includeWishlisted, includeInCart, includeRated, includeHidden);

    return Item.findOne({where, include});
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