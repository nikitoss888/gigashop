const {sequelize_db} = require('../db');
import {DataTypes, Op} from 'sequelize';
import {PublicationComment, User, PublicationTag} from "./index";

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
                            includeHidden = false, violation = false, violationReason?: string) => {
    let where: {title?: {}, content?: {}, createdAt?: {}, hide?: {}, violation?: {}, violationReason?: {}} = {};

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
    where.hide = includeHidden;
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

    return where;
}
const _includeHandler = (includeTags: boolean, includeComments: boolean, includeViolations: boolean,
                         includeHidden: boolean) => {
    let include: {}[] = [];

    if (includeTags) {
        include.push({
            model: PublicationTag,
            as: 'Tags',
            attributes: ['name'],
        });
    }

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
            attributes: ['content', 'rate', 'createdAt', 'updatedAt'],
            include: [{
                model: User,
                as: 'User',
                attributes: ['id', 'firstName', 'lastName', 'login', 'image']
            }],
            required: false,
            where
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
    includeTags?: boolean,
    includeComments?: boolean,
    includeViolations?: boolean,
    includeHidden?: boolean,
    violationReason?: string
}
const getPublications = async ({title, content, createdAt, createdFrom, createdTo, descending = false,
                                   limit = 10, page = 0, sortBy = 'createdAt', includeTags = true,
                                   includeComments = true, includeViolations = false, includeHidden = false,
                                   violationReason}: getAllPublicationsParams) => {
    const where   = _whereHandler(title, content, createdAt, createdFrom, createdTo, includeHidden, includeViolations, violationReason);
    const include = _includeHandler(includeTags, includeComments, includeViolations, includeHidden);
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
    includeTags?: boolean,
    includeComments?: boolean,
    includeViolations?: boolean,
    includeHidden?: boolean
}
const getPublication = async ({id, includeTags = true, includeComments = true, includeViolations = false,
                                  includeHidden = false}: getOnePublicationParams) => {
    const where = {
        id,
        hide: {
            [Op.in]: [includeHidden, false]
        },
    }
    const include = _includeHandler(includeTags, includeComments, includeViolations, includeHidden);
    return await Publication.findOne({where, include});
}

const getPublicationsByTags = async (tagNames: string[] | string, includeComments = true,
                                     includeViolations = false, includeHidden = false) => {
    const include = _includeHandler(false, includeComments, includeViolations, includeHidden);

    let where;
    if (tagNames instanceof Array) {
        where = {
            [Op.or]: tagNames.map((name: string) => {
                return { [Op.like]: `%${name}%` };
            })
        };
    }
    else {
        where = {
            [Op.like]: `%${tagNames}%`
        };
    }

    include.push({
        model: PublicationTag,
        as: 'Tags',
        where,
        attributes: ['name', [sequelize_db.fn('COUNT', sequelize_db.col('Tags.id')), 'count']],
        group: ['Tags.name'],
    });

    return Publication.findAll({
        include: include,
    });
}

export default Publication;
export {
    Publication,
    getPublications,
    getPublication,
    getPublicationsByTags
}