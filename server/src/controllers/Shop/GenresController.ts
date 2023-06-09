import type { Request, Response, NextFunction } from 'express';
import Controller from '../Controller';
import {Genre} from "../../models";
import {getGenre, getGenres} from "../../models/Genre";
import ApiError from "../../errors/ApiError";

class GenresController extends Controller {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, description} = req.body;

            const genre = await Genre
                .create({name, description})
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                }
            );

            if (!genre) {
                return next(ApiError.badRequest('Жанр не створено'));
            }
            res.json(genre);
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        let { name, description, desc, descending, limit, page, sortBy, hide } = req.query;

        const hideParsed = super.parseBoolean(hide as string | undefined) || false;
        let {descending: descendingParsed, limit: limitParsed, page: pageParsed} =
            super.parsePagination(desc as string | undefined, descending as string | undefined,
                limit as string | undefined, page as string | undefined);

        const genres = await getGenres({
            name: name as string | undefined, description: description as string | undefined,
            descending: descendingParsed, limit: limitParsed, page: pageParsed, sortBy: sortBy as string | undefined,
            includeHidden: hideParsed
        })
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            }
        );
        if (!genres) return next(ApiError.badRequest('Жанрів не знайдено'));
        res.json(genres);
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const hideParsed = super.parseBoolean(req.query.hide as string | undefined);

        const genre = await getGenre({ id: +id, includeItems: true, includeHidden: hideParsed });
        if (!genre) return next(ApiError.badRequest('Жанр не знайдено'));
        res.json(genre);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, hide } = req.body;

        let hideParsed = super.parseBoolean(hide as string | undefined);

        const genre = await Genre
            .update({name, description, hide: hideParsed}, {where: {id}})
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            }
        );
        if (!genre) return next(ApiError.badRequest('Жанр не оновлено'));
        res.json(genre);
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
        res.json(genre);
    }

    async test(req: Request, res: Response) {
        res.json({message: `Genres route works!`, request: {body: req.body, query: req.query}})
    }
}

export default new GenresController();