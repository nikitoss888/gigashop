import type { Request, Response, NextFunction } from 'express';
import Controller from '../Controller';
import {Genre} from "../../models";
import {getGenre, getGenres} from "../../models/Genre";
import ApiError from "../../errors/ApiError";

class GenresController extends Controller {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, description} = req.body;
            const hide = super.parseBoolean(req.body.hide) || false;

            const genre = await Genre
                .create({name, description, hide})
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                }
            );

            if (!genre) {
                return next(ApiError.badRequest('Жанр не створено'));
            }
            return res.json(genre);
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        let { name,
            description,
            desc,
            descending,
            limit,
            page,
            sortBy,
            hidden } = req.query;

        const hideParsed = super.parseBoolean(hidden as string | undefined) || false;
        let {descending: descendingParsed, limit: limitParsed, page: pageParsed} =
            super.parsePagination(desc as string | undefined, descending as string | undefined,
                limit as string | undefined, page as string | undefined);

        const result = await getGenres({
            name: name as string | undefined, description: description as string | undefined,
            descending: descendingParsed, limit: limitParsed, page: pageParsed, sortBy: sortBy as string | undefined,
            includeHidden: hideParsed
        })
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            }
        );
        if (!result) return next(ApiError.badRequest('Жанрів не знайдено'));

        const { genres, totalCount } = result;

        if (!genres) return next(ApiError.badRequest('Жанрів не знайдено'));
        return res.json({ genres, totalCount });
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const includeItems = super.parseBoolean(req.query.includeItems as string | undefined);
        const hideParsed = super.parseBoolean(req.query.includeHidden as string | undefined);

        const genre = await getGenre({ id: id, includeItems, includeHidden: hideParsed });
        if (!genre) return next(ApiError.badRequest('Жанр не знайдено'));
        return res.json(genre);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, hide } = req.body;

        let hideParsed = super.parseBoolean(hide as string | undefined);

        const genre = await Genre.findByPk(id);
        if (!genre) return next(ApiError.badRequest('Жанр не знайдено'));

        if (name) genre.name = name;
        if (description) genre.description = description;
        if (hideParsed !== undefined) genre.hide = hideParsed;

        const result = await genre
            .save()
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
        });

        if (!result) return next(ApiError.badRequest('Жанр не оновлено'));
        return res.json(genre);
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const genre = await Genre
            .destroy({where: {id}})
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            }
        );
        if (!genre) return next(ApiError.badRequest('Жанр не видалено'));
        return res.json({ ok: true });
    }

    async test(req: Request, res: Response) {
        return res.json({message: `Genres route works!`, request: {body: req.body, query: req.query}})
    }
}

export default new GenresController();