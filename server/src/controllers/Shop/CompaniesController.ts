import type {NextFunction, Request, Response} from 'express';
import { Company } from "../../models";
import { ValidationError as SequelizeValidationError } from "sequelize";
import ApiError from "../../errors/ApiError";
import Controller from "../Controller";
import path from "path";

export default class CompaniesController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, description, director, foundedYear} = req.body;
            const image = req.file;

            if (!image) {
                return next(ApiError.badRequest('Зображення не завантажено'));
            }

            let imageName = image.filename;

            const company = await Company
                .create({name, description, director, image: imageName, foundedYear})
                .catch((e: SequelizeValidationError | unknown) => {
                    const fs = require('fs');
                    fs.unlink(path.resolve('../static', 'companies', imageName), (err: unknown) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                    return next(Controller.exceptionHandle(e));
                });
            res.json(company);
        }
        catch (e) {
            return next(Controller.exceptionHandle(e));
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        let { hide } = req.query;

        const companies = await Company
            .findAll({where: {hide: hide ? hide : false}})
            .catch((e: SequelizeValidationError | unknown) => {
                return next(Controller.exceptionHandle(e));
        });
        res.json(companies);
    }

    static async getOne(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const company = await Company
            .findByPk(id)
            .catch((e: SequelizeValidationError | unknown) => {
                return next(Controller.exceptionHandle(e));
            });
        res.json(company);
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, director, image, foundedYear, hide } = req.body;

        const company = await Company
            .update({ name, description, director, image, foundedYear, hide }, {where: {id}})
            .catch((e: SequelizeValidationError | unknown) => {
                return next(Controller.exceptionHandle(e));
            });
        res.json(company);
    }

    static async test(req: Request, res: Response) {
        res.json({message: `Companies route works!`, request: {body: req.body, query: req.query}})
    }
}