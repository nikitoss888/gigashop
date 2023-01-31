import type { Request, Response, NextFunction } from 'express';
import Controller from '../Controller';
import {Genre} from "../../models";
import {getGenres} from "../../models/Genre";

class GenresController extends Controller {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, description} = req.body;
            console.log(req.body);

            const genre = await Genre
                .create({name, description})
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                }
            );
            res.json(genre);
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        let { name, description } = req.query;

        const genres = await getGenres(name as string | undefined, description as string | undefined)
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            }
        );
        res.json(genres);
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const genre = await Genre
            .findByPk(id)
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            }
        );
        res.json(genre);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, hide } = req.body;

        const genre = await Genre
            .update({name, description, hide}, {where: {id}})
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            }
        );
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
        res.json(genre);
    }

    async test(req: Request, res: Response) {
        res.json({message: `Genres route works!`, request: {body: req.body, query: req.query}})
    }
}

export default new GenresController();