import type { Request, Response } from 'express';

class GenresController {
    // async create(req: Request, res: Response) {
    //
    // }
    //
    // async getAll(req: Request, res: Response) {
    //
    // }
    //
    // async getOne(req: Request, res: Response) {
    //
    // }

    async test(req: Request, res: Response) {
        res.json({message: `Genres route works!`, request: {body: req.body, query: req.query}})
    }
}

export default new GenresController();