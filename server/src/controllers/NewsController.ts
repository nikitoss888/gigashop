import type {NextFunction, Request, Response} from 'express';
import Controller from './Controller';
import Publication, { getPublication, getPublications } from "../models/Publication";
import ApiError from "../errors/ApiError";
import PublicationComment, { getAllComments } from "../models/PublicationComment";
import User from "../models/User";

class NewsController extends Controller {
    private static async _checkPublication(id?: number | string) {
        if (!id) throw ApiError.badRequest('Неправильний id публікації');
        const news = await Publication.findByPk(id);
        if (!news) throw ApiError.badRequest('Публікацію не знайдено');
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, content, hide } = req.body;
            let { tags } = req.body;

            const hideParsed = super.parseBoolean(hide);
            const userId = req.user.id;
            if (tags && !Array.isArray(tags)) tags = [tags];

            const publication = await Publication
                .create({ title, content, hide: hideParsed, userId, tags })
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            if (!publication) {
                return next(ApiError.badRequest('Публікацію не створено'));
            }

            if (!tags) return res.json(publication);

            return res.json(publication);
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, content,
                createdAt, createdFrom, createdTo,
                desc, descending, limit,
                page, sortBy, hidden
            } = req.query;

            let { tags } = req.query;
            if (tags && typeof tags === 'string') tags = [tags];

            let { authorsIds } = req.query;
            if (authorsIds && typeof authorsIds === 'string') authorsIds = [authorsIds];

            const createdAtParsed = super.parseDate(createdAt as string | undefined);
            const createdFromParsed = super.parseDate(createdFrom as string | undefined);
            const createdToParsed = super.parseDate(createdTo as string | undefined);
            const hideParsed = super.parseBoolean(hidden as string | undefined) || false;

            let {descending: descendingParsed, limit: limitParsed, page: pageParsed} =
                super.parsePagination(desc as string | undefined, descending as string | undefined,
                    limit as string | undefined, page as string | undefined);

            const result = await getPublications({
                title: title as string | undefined, content: content as string | undefined,
                createdAt: createdAtParsed, createdFrom: createdFromParsed, createdTo: createdToParsed,
                descending: descendingParsed, limit: limitParsed, page: pageParsed, sortBy: sortBy as string | undefined,
                includeHidden: hideParsed, tags: tags as string[] | undefined, authorsIds: authorsIds as number[] | undefined
            })
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });
            if (!result) return next(ApiError.badRequest('Публікацій не знайдено'));

            const { publications, totalCount } = result;

            if (!publications) return next(ApiError.badRequest('Публікацій не знайдено'));

            return res.json({ publications, totalCount });
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = super.parseNumber(req.params.id);
            if (!id) return next(ApiError.badRequest('Неправильний id публікації'));
            const includeComments = super.parseBoolean(req.query.includeComments as string | undefined) || true;
            const includeViolations = super.parseBoolean(req.query.includeViolations as string | undefined) || false;
            const includeHidden = super.parseBoolean(req.query.includeHidden as string | undefined) || false;

            const publication = await getPublication({
                id,
                includeComments,
                includeViolations,
                includeHidden
            })
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            if (!publication) return next(ApiError.badRequest('Публікацію не знайдено'));

            return res.json(publication);
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { title, content, hide } = req.body;
            let { tags } = req.body;
            if (tags && !Array.isArray(tags)) tags = [tags];

            let hideParsed = super.parseBoolean(hide as string | undefined);

            let publication = await Publication.findByPk(id);
            if (!publication) return next(ApiError.badRequest('Публікацію не знайдено'));

            if (title) publication.title = title;
            if (content) publication.content = content;
            if (publication.violation) hideParsed = true;
            if (hide) publication.hide = hideParsed;
            if (tags) publication.tags = tags;

            let err: unknown;
            const result = await publication.save()
                .catch((e: unknown) => {
                    err = e;
                });
            if (err) return next(super.exceptionHandle(err));

            if (!result) return next(ApiError.badRequest('Публікацію не оновлено'));

            return res.json(publication);
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async toggleViolation (req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { violation, violation_reason } = req.body;

            let violationParsed = super.parseBoolean(violation as string | undefined) || false;

            const publication = await Publication.findByPk(id);
            if (!publication) return next(ApiError.badRequest('Публікацію не знайдено'));

            if (!violationParsed) {
                publication.violation = false;
                publication.violation_reason = null;
            }
            else {
                publication.violation = true;
                publication.hide = true;
                publication.violation_reason = violation_reason;
            }

            const result = await publication.save()
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            return res.json({ message: 'Статус порушення оновлено', result });
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async toggleCommentViolation(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { violation, violation_reason } = req.body;

            let violationParsed = super.parseBoolean(violation as string | undefined);

            const comment = await PublicationComment.findByPk(id);
            if (!comment) return next(ApiError.badRequest('Коментар не знайдено'));

            if (!violationParsed) {
                comment.violation = false;
                comment.hide = false;
                comment.violation_reason = null;
            }
            else {
                comment.violation = violationParsed;
                comment.hide = true;
                comment.violation_reason = violation_reason;
            }

            const result = await comment.save();

            return res.json({ message: "Статус порушення оновлено", result });
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const publication = await Publication.findByPk(id);
            if (!publication) return next(ApiError.badRequest('Публікацію не знайдено'));

            const author = await User.findByPk(publication.userId);
            if (req.user.id !== author.id && author.role.toLowerCase() === "user") {
                return next(ApiError.badRequest("Ви не можете видалити чужу публікацію"));
            }

            await Publication.
                destroy({ where: { id } })
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            return res.json({ ok: true });
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async getComments(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            await NewsController._checkPublication(id)
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            const comments = await PublicationComment.findAll({
                where: { publicationId: id },
                attributes: ['content', 'rate', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: User,
                        as: 'User',
                        attributes: ['id', 'firstName', 'lastName', 'login', 'image'],
                    },
                ],
            });

            return res.json({ message: "Коментарі успішно отримано", comments });
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async getAllComments(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                sortBy
            } = req.query;
            let descending = super.parseBoolean(req.query.desc as string);
            if (descending === undefined) descending = super.parseBoolean(req.query.descending as string) || false;
            const limit = super.parseNumber(req.query.limit as string) || 12;
            const page = super.parseNumber(req.query.page as string) || 1;

            const result = getAllComments({sortBy: sortBy as string, descending, limit, page});
            if (!result) return next(ApiError.badRequest('Невірні параметри запиту'));

            const { totalCount, comments } = await result;

            if (!comments) return next(ApiError.badRequest('Коментарі не знайдено'));
            return res.json({ totalCount, comments });
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async setComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const rate = super.parseNumber(req.body.rate as string);

            if (!req.user) return next(ApiError.unauthorized('Необхідна авторизація'));
            const user = await User.findByPk(req.user.id);
            if (!user) return next(ApiError.notFound('Користувача не знайдено'));

            const publication = await Publication.findByPk(id);
            if (!publication) return next(ApiError.notFound('Публікацію не знайдено'));
            if (publication.hide) return next(ApiError.forbidden('Немає доступу'));
            if (publication.userId === req.user.id) return next(ApiError.forbidden('Не можна оцінювати власну публікацію'));

            const publicationComment = await PublicationComment.findOne({ where: { publicationId: id, userId: req.user.id } });

            if (!publicationComment) {
                if (!rate) return next(ApiError.badRequest('Невірна оцінка'));
                const newComment = await PublicationComment.create({ content, rate, publicationId: id, userId: req.user.id });
                return res.json({ message: "Коментар успішно додано", comment: newComment, user });
            }

            if (content) publicationComment.content = content;
            if (rate) publicationComment.rate = rate;

            await publicationComment.save();
            return res.json({ message: "Коментар успішно оновлено", comment: publicationComment, user });
        }
        catch (e) {
            return next(super.exceptionHandle(e));
        }
    }

    async removeComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (!req.user) return next(ApiError.unauthorized('Необхідна авторизація'));
            const user = await User.findByPk(req.user.id);
            if (!user) return next(ApiError.notFound('Користувача не знайдено'));

            const publicationComment = await PublicationComment.findOne({ where: { publicationId: id, userId: req.user.id } });
            if (!publicationComment) return next(ApiError.badRequest('Коментар не знайдено'));

            await publicationComment.destroy();
            return res.json({ message: "Коментар успішно видалено", ok: true });
        }
        catch (e) {
            return next(super.exceptionHandle(e));
        }
    }

    async test(req: Request, res: Response) {
        return res.json({message: `News route works!`, request: {body: req.body, query: req.query}})
    }
}

export default new NewsController();