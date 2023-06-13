const {sequelize_db} = require('../db');
import {DataTypes, Op} from 'sequelize';
import {PublicationComment, User} from "./index";

const Publication = sequelize_db.define('publication', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    hide: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
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
}, {
    paranoid: true,
});

const _whereHandler = (title?: string, content?: string,
                       createdAt?: Date, createdFrom?: Date, createdTo?: Date,
                       includeHidden = false, tags?: string[],
                       violation = false, violationReason?: string) => {
    let where: {title?: {}, content?: {}, createdAt?: {}, hide?: {}, violation?: {}, violationReason?: {}, tags?: {}} = {};

    console.log({
        title,
        content,
        createdAt,
        createdFrom,
        createdTo,
        includeHidden,
        violation,
        violationReason,
        tags,
    })

    if (title) {
        where.title = {
            [Op.iLike]: `%${title}%`
        };
    }
    if (content) {
        where.content = {
            [Op.iLike]: `%${content}%`
        };
    }
    if (!includeHidden) {
        where.hide = includeHidden;
    }
    where.violation = violation;
    if (violation && violationReason) {
        where.violationReason = {
            [Op.like]: `%${violationReason}%`
        };
    }
    if (createdAt) {
        where.createdAt = sequelize_db.where(sequelize_db.fn('date', sequelize_db.col('createdAt')), createdAt);
    }
    if (createdFrom) {
        where.createdAt = {
            ...where.createdAt,
            [Op.gte]: createdFrom
        };
    }
    if (createdTo) {
        createdTo.setDate(createdTo.getDate() + 1);
        where.createdAt = {
            ...where.createdAt,
            [Op.lte]: createdTo
        };
    }
    if (tags && tags.length > 0) {
        console.log(tags)
        where.tags = {
            [Op.contains]: tags
        };
    }

    return where;
}
const _includeHandler = (includeComments: boolean, includeViolations: boolean,
                         includeHidden: boolean, authorsIds?: number[]) => {
    let include: {}[] = [];

    include.push({
        model: User,
        as: 'AuthoredUser',
        attributes: {exclude: ['password']},
    })

    if (includeComments) {
        let where = {};

        if (!includeHidden) {
            where = {
                hide: false
            };
        }
        if (!includeViolations) {
            where = {
                ...where,
                violation: false,
            };
        }

        include.push({
            model: PublicationComment,
            as: 'CommentsList',
            include: [{
                model: User,
                as: 'User',
                attributes: {exclude: ['password']},
            }],
            required: false,
            where
        });
    }

    if (authorsIds && authorsIds.length > 0) {
        include.push({
            model: User,
            as: 'AuthoredUser',
            attributes: {exclude: ['password']},
            where: {
                id: {
                    [Op.in]: authorsIds
                }
            }
        });
    }

    return include;
}
type getAllPublicationsParams = {
    title?: string,
    content?: string,
    createdAt?: Date,
    createdFrom?: Date,
    createdTo?: Date,
    descending?: boolean,
    limit?: number,
    page?: number,
    sortBy?: string,
    tags?: string[],
    authorsIds?: number[],
    includeComments?: boolean,
    includeViolations?: boolean,
    includeHidden?: boolean,
    violationReason?: string
}
const getPublications = async ({title, content, createdAt, createdFrom, createdTo, descending = false,
                                   limit = 10, page = 0, sortBy = 'createdAt', tags = [], authorsIds = [],
                                   includeComments = true, includeViolations = false, includeHidden = false,
                                   violationReason}: getAllPublicationsParams) => {
    console.log({
        title,
        content,
        createdAt,
        createdFrom,
        createdTo,
        descending,
        limit,
        page,
        sortBy,
        tags,
        authorsIds,
    });
    const where   = _whereHandler(title, content, createdAt, createdFrom, createdTo, includeHidden, tags, includeViolations, violationReason);
    const include = _includeHandler(includeComments, includeViolations, includeHidden, authorsIds);
    const totalCount = await Publication.count({where: includeHidden ? {} : { hide: false }});
    const publications = await Publication.findAll({
        where, limit, offset: page * limit, order: [[sortBy, descending ? 'DESC' : 'ASC']], include
    });

    return {
        publications,
        totalCount,
    };
}
type getOnePublicationParams = {
    id: number,
    includeComments?: boolean,
    includeViolations?: boolean,
    includeHidden?: boolean
}
const getPublication = async ({id, includeComments = true, includeViolations = false,
                                  includeHidden = false}: getOnePublicationParams) => {
    const include = _includeHandler(includeComments, includeViolations, includeHidden);
    return await Publication.findByPk(id, {include});
}

export default Publication;
export {
    Publication,
    getPublications,
    getPublication,
}