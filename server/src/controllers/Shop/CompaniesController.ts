import type {NextFunction, Request, Response} from 'express';
import ApiError from "../../errors/ApiError";
import Controller from "../Controller";
import {Company, getCompanies} from "../../models/Company";

const COMPANIES_DIR = 'companies';

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
                    super.deleteFile(COMPANIES_DIR, imageName);
                    return next(super.exceptionHandle(e));
                });

            if (!company) {
                super.deleteFile(COMPANIES_DIR, imageName);
                return next(ApiError.badRequest('Компанію не створено'));
            }

            res.json(company);
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        let { name, description, director, founded, desc, descending, limit, page, sortBy } = req.query;

        let foundedParsed = super.parseDate(founded as string | undefined);

        let {descending: descendingParsed, limit: limitParsed, page: pageParsed} =
            super.parsePagination(desc as string | undefined, descending as string | undefined,
                limit as string | undefined, page as string | undefined);

        const companies = await getCompanies(
            name as string | undefined, description as string | undefined,
            director as string | undefined, foundedParsed,
            descendingParsed, limitParsed, pageParsed, sortBy as string | undefined
        )
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
        });

        if (!companies) return next(ApiError.badRequest('Компаній не знайдено'));
        res.json(companies);
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const company = await Company
            .findByPk(id)
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });

        if (!company) return next(ApiError.badRequest('Компанію не знайдено'));
        res.json(company);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, director, founded, hide } = req.body;
        const image = req.file;

        let imageName: string | undefined;
        let oldImageName = (await Company.findByPk(id)).image;
        if (image) {
            imageName = image.filename;
        }

        let hideParsed = super.parseBoolean(hide as string | undefined);

        const company = await Company
            .update({ name, description, director, image: imageName, founded, hide: hideParsed }, {where: {id}})
            .catch((e: unknown) => {
                if (imageName) super.deleteFile(COMPANIES_DIR, imageName);
                return next(super.exceptionHandle(e));
            });
        if (!company) {
            if (imageName) super.deleteFile(COMPANIES_DIR, imageName);
            return next(ApiError.badRequest('Компанію не оновлено'));
        }
        if (imageName) super.deleteFile(COMPANIES_DIR, oldImageName);
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

        if (!deletedCompany) return next(ApiError.badRequest('Компанію не видалено'));
        super.deleteFile(COMPANIES_DIR, company.image);
        res.json(deletedCompany);
    }

    async test(req: Request, res: Response) {
        res.json({message: `Companies route works!`, request: {body: req.body, query: req.query}})
    }
}
export default new CompaniesController();