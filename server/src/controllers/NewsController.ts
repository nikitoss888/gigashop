import type {NextFunction, Request, Response} from 'express';
import Controller from './Controller';
import Publication, { getPublication, getPublications } from "../models/Publication";
import ApiError from "../errors/ApiError";
import PublicationComment from "../models/PublicationComment";
import User from "../models/User";
import PublicationTag from "../models/PublicationTag";

class NewsController extends Controller {
    private static async _checkPublication(id?: number | string) {
        if (!id) throw ApiError.badRequest('Неправильний id публікації');
        const news = await Publication.findByPk(id);
        if (!news) throw ApiError.badRequest('Публікацію не знайдено');
    }
    private static async _createTags(id: number | string, tagsNames: string | string[]) {
        if (tagsNames instanceof Array) {
            let data = tagsNames.map((name: string) => {
                return { publicationId: id, name }
            });

            return await PublicationTag.bulkCreate(data)
                .catch((e: unknown) => { throw e; });
        }

        return await PublicationTag.create({ publicationId: id, name: tagsNames })
            .catch((e: unknown) => { throw e; });
    }
    static async addTags(id: number | string, tagsNames: string | string[]) {
        let candidates = await PublicationTag.findAll({ where: { publicationId: id, name: tagsNames } });
        if (candidates.length > 0) throw ApiError.badRequest('Теги вже додані');

        await NewsController._checkPublication(id)
            .catch((e: unknown) => { throw e; });

        return await NewsController._createTags(id, tagsNames)
            .catch((e: unknown) => { throw e; });
    }
    static async removeTags(id: number | string, tagsNames?: string | string[]) {
        let where: { publicationId: number | string, name?: string | string[] } = { publicationId: id };
        if (tagsNames) where.name = tagsNames;

        return await PublicationTag.destroy({ where })
            .catch((e: unknown) => { throw e; });
    }
    static async setTags(id: number | string, tagsNames: string | string[]) {
        await NewsController._checkPublication(id)
            .catch((e: unknown) => { throw e; });

        await PublicationTag.destroy({ where: { publicationId: id } })
            .catch((e: unknown) => { throw e; });

        return await NewsController._createTags(id, tagsNames)
            .catch((e: unknown) => { throw e; });
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, content, hide, tags } = req.body;

            const hideParsed = super.parseBoolean(hide);
            const userId = req.user.id;

            const publication = await Publication
                .create({ title, content, hide: hideParsed, userId })
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            if (!publication) {
                return next(ApiError.badRequest('Публікацію не створено'));
            }

            if (!tags) return res.json({message: "Публікацію створено", publication});

            let err: unknown;
            let tagsRes = tags ? await NewsController._createTags(publication.id, tags)
                .catch((e: unknown) => {
                    err = e;
                }) : undefined;
            if (err) return next(super.exceptionHandle(err));

            return res.json({message: "Публікацію створено", publication, tags: tagsRes});
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
                page, sortBy, hide } = req.query;

            const createdAtParsed = super.parseDate(createdAt as string | undefined);
            const createdFromParsed = super.parseDate(createdFrom as string | undefined);
            const createdToParsed = super.parseDate(createdTo as string | undefined);
            const hideParsed = super.parseBoolean(hide as string | undefined) || false;

            let {descending: descendingParsed, limit: limitParsed, page: pageParsed} =
                super.parsePagination(desc as string | undefined, descending as string | undefined,
                    limit as string | undefined, page as string | undefined);

            const publications = await getPublications({
                title: title as string | undefined, content: content as string | undefined,
                createdAt: createdAtParsed, createdFrom: createdFromParsed, createdTo: createdToParsed,
                descending: descendingParsed, limit: limitParsed, page: pageParsed, sortBy: sortBy as string | undefined,
                includeHidden: hideParsed
            })
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            if (!publications) return next(ApiError.badRequest('Публікацій не знайдено'));

            res.json(publications);
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = super.parseNumber(req.params.id);
            if (!id) return next(ApiError.badRequest('Неправильний id публікації'));

            const includeTags = super.parseBoolean(req.query.includeTags as string | undefined) || true;
            const includeComments = super.parseBoolean(req.query.includeComments as string | undefined) || true;
            const includeViolations = super.parseBoolean(req.query.includeViolations as string | undefined) || false;
            const includeHidden = super.parseBoolean(req.query.includeHidden as string | undefined) || false;

            const publication = await getPublication({
                id,
                includeTags,
                includeComments,
                includeViolations,
                includeHidden
            })
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            if (!publication) return next(ApiError.badRequest('Публікацію не знайдено'));

            res.json(publication);
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { title, content, hide, tags } = req.body;

            let hideParsed = super.parseBoolean(hide as string | undefined);

            let publication = await Publication.findByPk(id);
            if (!publication) return next(ApiError.badRequest('Публікацію не знайдено'));

            if (title) publication.title = title;
            if (content) publication.content = content;
            if (publication.violation) hideParsed = true;
            if (hide) publication.hide = hideParsed;

            let err: unknown;
            const result = await publication.save()
                .catch((e: unknown) => {
                    err = e;
                });
            if (err) return next(super.exceptionHandle(err));

            if (!result) return next(ApiError.badRequest('Публікацію не оновлено'));

            if (!tags) return res.json({message: "Публікацію оновлено", publication});

            let tagsRes = tags ? await NewsController.setTags(id, tags)
                .catch((e: unknown) => {
                    err = e;
                }) : undefined;
            if (err) return next(super.exceptionHandle(err));

            res.json({message: "Публікацію оновлено", publication, tags: tagsRes});
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async violation(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { violation, violation_reason } = req.body;

            let hide: true | undefined;
            let violationParsed = super.parseBoolean(violation as string | undefined);
            if (violationParsed) hide = true;

            const result = await Publication.
                update({ hide, violation: violationParsed, violation_reason: violationParsed ? violation_reason : null },
                    { where: { id } })
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            res.json(result);
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
            if (publication.userId !== req.user.id) return next(ApiError.forbidden('Немає доступу'));

            const result = await Publication.
                destroy({ where: { id } })
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            await NewsController.removeTags(id);

            res.json(result);
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async createComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { content, rate } = req.body;

            let rateParsed = super.parseNumber(rate as string | undefined) || 0;
            if (rateParsed < 0 || rateParsed > 5) return next(ApiError.badRequest('Невірна оцінка'));

            await NewsController._checkPublication(id)
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            const comment = await PublicationComment.findOne({ where: { publicationId: id, userId: req.user.id } });
            if (comment) return next(ApiError.badRequest('Ви вже залишили коментар'));

            const result = await PublicationComment
                .create({ content, rate: rateParsed, publicationId: id, userId: req.user.id })

            res.json({ message: "Коментар успішно додано", comment: result });
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

            res.json({ message: "Коментарі успішно отримано", comments });
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async updateComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { content, rate } = req.body;
            const userId = req.user.id;

            let rateParsed = super.parseNumber(rate as string | undefined) || 0;
            if (rateParsed < 0 || rateParsed > 5) return next(ApiError.badRequest('Невірна оцінка'));

            await NewsController._checkPublication(id)
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            const comment = await PublicationComment.findOne({ where: { publicationId: id, userId } });
            if (!comment) return next(ApiError.badRequest('Коментар не знайдено'));
            if (comment.userId !== userId) return next(ApiError.forbidden('Немає доступу'));

            if (content) comment.content = content;
            if (rate) comment.rate = rateParsed;

            const result = await comment.save()
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            res.json({ message: "Коментар успішно оновлено", comment: result });
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const comment = await PublicationComment.findOne({ where: { publicationId: id, userId: req.user.id } });
            if (!comment) return next(ApiError.badRequest('Коментар не знайдено'));
            if (comment.userId !== req.user.id) return next(ApiError.forbidden('Немає доступу'));

            const result = await comment.destroy()
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            res.json({ message: "Коментар успішно видалено", result });
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async commentViolation(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { violation, violation_reason } = req.body;

            let hide: true | undefined;
            let violationParsed = super.parseBoolean(violation as string | undefined);
            if (violationParsed) hide = true;

            const comment = await PublicationComment.findByPk(id);
            if (!comment) return next(ApiError.badRequest('Коментар не знайдено'));

            if (violationParsed) comment.violation = violationParsed;
            if (violation_reason) comment.violation_reason = violationParsed ? violation_reason : null;
            if (hide) comment.hide = hide;
            const result = await comment.save();

            res.json(result);
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async test(req: Request, res: Response) {
        res.json({message: `News route works!`, request: {body: req.body, query: req.query}})
    }
}

export default new NewsController();