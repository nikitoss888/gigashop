import type { Request, Response, NextFunction } from 'express';
import Controller from '../Controller';
import {Genre} from "../../models";

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
            res.json(genre);
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        let { name, description } = req.query;

        const genres = await Genre
            .findAll({where: { name, description }})
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            }
        );
        res.json(genres);
    }

    async test(req: Request, res: Response) {
        res.json({message: `Genres route works!`, request: {body: req.body, query: req.query}})
    }
}

export default new GenresController();