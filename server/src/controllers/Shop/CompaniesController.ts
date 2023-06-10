import type {NextFunction, Request, Response} from 'express';
import ApiError from "../../errors/ApiError";
import Controller from "../Controller";
import {Company, getCompanies, getCompany} from "../../models/Company";

class CompaniesController extends Controller {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, description, director, founded, image} = req.body;
            let foundedParsed = super.parseDate(founded);

            const company = await Company
                .create({name, description, director, image, founded: foundedParsed})
                .catch((e: unknown) => {
                    // super.deleteFile(COMPANIES_DIR, imageName);
                    return next(super.exceptionHandle(e));
                });

            if (!company) {
                // super.deleteFile(COMPANIES_DIR, imageName);
                return next(ApiError.badRequest('Компанію не створено'));
            }

            return res.json(company);
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        let {
            name,
            description,
            director,
            founded,
            desc,
            descending,
            limit,
            page,
            sortBy,
            hide } = req.query;

        const foundedParsed = super.parseDate(founded as string | undefined);
        const hideParsed = super.parseBoolean(hide as string | undefined) || false;

        let {descending: descendingParsed, limit: limitParsed, page: pageParsed} =
            super.parsePagination(desc as string | undefined, descending as string | undefined,
                limit as string | undefined, page as string | undefined);

        const result = await getCompanies({
            name: name as string | undefined, description: description as string | undefined,
            director: director as string | undefined, founded: foundedParsed,
            descending: descendingParsed, limit: limitParsed, page: pageParsed, sortBy: sortBy as string | undefined,
            includeHidden: hideParsed
        })
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
        });
        if (!result) return next(ApiError.badRequest('Компаній не знайдено'));

        const { companies, totalCount } = result;

        if (!companies) return next(ApiError.badRequest('Компаній не знайдено'));
        return res.json({ companies, totalCount });
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const includeItemsDeveloped = super.parseBoolean(req.query.includeDeveloped as string | undefined) || true;
        const includeItemsPublished = super.parseBoolean(req.query.includePublished as string | undefined) || true;
        const includeHidden = super.parseBoolean(req.query.includeHidden as string | undefined) || false;

        const company = await getCompany({
            id: +id, includeItemsDeveloped, includeItemsPublished, includeHidden
        });

        if (!company) return next(ApiError.badRequest('Компанію не знайдено'));
        return res.json(company);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, director, founded, hide, image } = req.body;

        const company = await Company.findByPk(id)
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });
        if (!company) return next(ApiError.badRequest('Компанію не знайдено'));

        // let oldImage = company.image;

        let hideParsed = super.parseBoolean(hide as string | undefined);
        let foundedParsed = super.parseDate(founded);

        if (name) company.name = name;
        if (description) company.description = description;
        if (director) company.director = director;
        if (founded) company.founded = foundedParsed;
        if (hide) company.hide = hideParsed;
        if (image) company.image = image;

        let result = await company.save()
            .catch((e: unknown) => {
                // if (image) super.deleteFile(COMPANIES_DIR, image);
                return next(super.exceptionHandle(e));
            });

        if (!result) {
            // if (image) super.deleteFile(COMPANIES_DIR, image);
            return next(ApiError.badRequest('Компанію не оновлено'));
        }

        // ToDo: delete files
        //
        // if (image) super.deleteFile(COMPANIES_DIR, oldImage);
        return res.json(company);
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const company = await Company
            .findByPk(id)
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });
        // const { image } = company;

        const result = await company.destroy()
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });

        if (!result) return next(ApiError.badRequest('Компанію не видалено'));

        // ToDo: delete files
        //
        // super.deleteFile(COMPANIES_DIR, image);
        return res.json(result);
    }

    async test(req: Request, res: Response) {
        return res.json({message: `Companies route works!`, request: {body: req.body, query: req.query}})
    }
}
export default new CompaniesController();