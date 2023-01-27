import type { Request, Response } from 'express';
import Controller from './Controller';

class UserController extends Controller {
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

    static async test(req: Request, res: Response) {
        res.json({message: `News route works!`, request: {body: req.body, query: req.query}})
    }
}

export default UserController;