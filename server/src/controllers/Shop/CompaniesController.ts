import type {NextFunction, Request, Response} from 'express';
import { Company } from "../../models";
import ApiError from "../../errors/ApiError";
import Controller from "../Controller";
import {getCompanies} from "../../models/Company";

class CompaniesController extends Controller {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, description, director, founded} = req.body;
            const image = req.file;

            if (!image) {
                return next(ApiError.badRequest('Зображення не завантажено'));
            }

            let imageName = image.filename;

            const company = await Company
                .create({name, description, director, image: imageName, founded})
                .catch((e: unknown) => {
                    super.deleteFile('companies', imageName);
                    return next(super.exceptionHandle(e));
                });
            res.json(company);
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        let { name, description, director, founded } = req.query;

        const companies = await getCompanies(name as string | undefined, description as string | undefined,
            director as string | undefined, founded as string | undefined)
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
        });
        res.json(companies);
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const company = await Company
            .findByPk(id)
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });
        res.json(company);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, director, founded, hide } = req.body;
        const image = req.file;

        if (!image) {
            return next(ApiError.badRequest('Зображення не завантажено'));
        }

        let imageName = image.filename;
        let oldImageName = (await Company.findByPk(id)).image;

        const company = await Company
            .update({ name, description, director, image: imageName, founded, hide }, {where: {id}})
            .catch((e: unknown) => {
                super.deleteFile('companies', imageName);
                return next(super.exceptionHandle(e));
            });
        super.deleteFile('companies', oldImageName);
        res.json(company);
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const company = await Company
            .findByPk(id)
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });

        const deletedCompany = await Company
            .destroy({where: {id}})
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });
        super.deleteFile('companies', company.image);
        res.json(deletedCompany);
    }

    async test(req: Request, res: Response) {
        res.json({message: `Companies route works!`, request: {body: req.body, query: req.query}})
    }
}
export default new CompaniesController();