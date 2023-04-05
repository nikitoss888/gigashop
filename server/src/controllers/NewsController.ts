import type {NextFunction, Request, Response} from 'express';
import Controller from './Controller';
import Publication, { getPublications } from "../models/Publication";
import ApiError from "../errors/ApiError";
import PublicationComment from "../models/PublicationComment";
import {User} from "../models";

class NewsController extends Controller {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, content, hide } = req.body;

            const hideParsed = super.parseBoolean(hide);
            const userId = req.user.id;

            const company = await Publication
                .create({ title, content, hide: hideParsed, userId })
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            if (!company) {
                return next(ApiError.badRequest('Публікацію не створено'));
            }

            res.json(company);
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, content, createdAt, createdFrom, createdTo,
                desc, descending, limit, page, sortBy } = req.query;

            let createdAtParsed = super.parseDate(createdAt as string | undefined);
            let createdFromParsed = super.parseDate(createdFrom as string | undefined);
            let createdToParsed = super.parseDate(createdTo as string | undefined);

            let {descending: descendingParsed, limit: limitParsed, page: pageParsed} =
                super.parsePagination(desc as string | undefined, descending as string | undefined,
                    limit as string | undefined, page as string | undefined);

            const publications = await getPublications(
                title as string | undefined, content as string | undefined,
                createdAtParsed, createdFromParsed, createdToParsed,
                descendingParsed, limitParsed, pageParsed, sortBy as string | undefined
            )
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            if (!publications) return next(ApiError.badRequest('Публікацій не знайдено'));

            res.json(publications);
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const publication = await Publication.findByPk(id)
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
            const { title, content, hide } = req.body;

            let hideParsed = super.parseBoolean(hide as string | undefined);

            let publication = await Publication.findByPk(id);
            if (!publication) return next(ApiError.badRequest('Публікацію не знайдено'));

            if (publication.violation) hideParsed = true;

            const result = await Publication.
                update({ title, content, hide: hideParsed },
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

            const publication = await Publication.findByPk(id);
            if (!publication) return next(ApiError.badRequest('Публікацію не знайдено'));

            const result = await PublicationComment
                .create({ content, rate: rateParsed, publicationId: id, userId: req.user.id })

            res.json(result);
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async getComments(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const publication = await Publication.findByPk(id);
            if (!publication) return next(ApiError.badRequest('Публікацію не знайдено'));

            const comments = await PublicationComment.findAll({
                where: { publicationId: id },
                include: [
                    {
                        model: User,
                        as: 'User',
                        attributes: ['id', 'firstName', 'lastName', 'login', 'image'],
                    },
                ],
            });

            res.json(comments);
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async updateComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { content, rate } = req.body;

            let rateParsed = super.parseNumber(rate as string | undefined) || 0;

            const publication = await Publication.findByPk(id);
            if (!publication) return next(ApiError.badRequest('Публікацію не знайдено'));

            const comment = await PublicationComment.findByPk(id);
            if (!comment) return next(ApiError.badRequest('Коментар не знайдено'));
            if (comment.userId !== req.user.id) return next(ApiError.forbidden('Немає доступу'));

            publication.content = content;
            publication.rate = rateParsed;
            const result = await publication.save();

            res.json(result);
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const publication = await Publication.findByPk(id);
            if (!publication) return next(ApiError.badRequest('Публікацію не знайдено'));

            const comment = await PublicationComment.findByPk(id);
            if (!comment) return next(ApiError.badRequest('Коментар не знайдено'));
            if (comment.userId !== req.user.id) return next(ApiError.forbidden('Немає доступу'));

            const result = await PublicationComment.
                destroy({ where: { id } })
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

    async commentViolation(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { violation, violation_reason } = req.body;

            let hide: true | undefined;
            let violationParsed = super.parseBoolean(violation as string | undefined);
            if (violationParsed) hide = true;

            const comment = await PublicationComment.findByPk(id);
            if (!comment) return next(ApiError.badRequest('Коментар не знайдено'));

            comment.violation = violationParsed;
            comment.violation_reason = violationParsed ? violation_reason : null;
            comment.hide = hide;
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