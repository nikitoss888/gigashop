import type {NextFunction, Request, Response} from 'express';
import { ValidationError as SequelizeValidationError } from "sequelize";
import ApiError from "../errors/ApiError";
import path from "path";
import { Company, Genre, Item, ItemRate, Publication, PublicationComment, User, Wishlist } from "../models";

export default class Controller {
    protected exceptionHandle(error: unknown): ApiError {
        if (error instanceof SequelizeValidationError) {
            return ApiError.badRequest(error.name, error.errors);
        }
        else if (error instanceof ApiError) {
            return error;
        }
        else if (error instanceof Error) {
            return ApiError.internal(error.message);
        }
        else return ApiError.internal("Помилка обробки запиту");
    }

    // Delete file from static folder
    protected deleteFile(dir: string, file: string) {
        const fs = require('fs');

        if(!fs.existsSync(path.resolve('./static', dir, file))) return;

        fs.unlink(path.resolve('./static', dir, file), (err: unknown) => {
            if (err) {
                console.error(err);
            }
        });
    }

    protected parseDate(date: string | undefined): Date | undefined {
        if (!date) return undefined;
        return new Date(date);
    }

    protected parseNumber(number: string | undefined): number | undefined {
        if (number === undefined) return undefined;
        return Number(number);
    }

    protected parseBoolean(boolean?: boolean | string | number): boolean | undefined {
        if (boolean === undefined) return undefined;
        if (!boolean) return false;
        return [true, 'true', 'True', 'on', 'yes', '1', 1].includes(boolean);
    }

    protected parsePagination(desc: string | boolean | number | undefined,
                              descending: string | boolean | number | undefined,
                              limit: string | undefined, page: string | undefined):
        { descending: boolean | undefined, limit: number | undefined, page: number | undefined }
    {
        let controller = new Controller();

        let descendingParsed: boolean | undefined;
        if (desc) descendingParsed = controller.parseBoolean(desc as boolean | string | number | undefined);
        else descendingParsed = controller.parseBoolean(descending as boolean | string | number | undefined);

        let limitParsed = controller.parseNumber(limit as string | undefined);
        let pageParsed = Math.max(controller.parseNumber(page as string | undefined) || 1, 1);

        return { descending: descendingParsed, limit: limitParsed, page: pageParsed - 1 };
    }

    async statistics(_: Request, res: Response, next: NextFunction) {
        try {
            const Users = await User.findAll();
            const Items = await Item.findAll({
                include: [
                    {
                        model: Company,
                        as: 'Developers',
                        through: { attributes: [] },
                    },
                    {
                        model: Company,
                        as: 'Publisher',
                    },
                    {
                        model: Genre,
                        as: 'Genres',
                        through: { attributes: [] },
                    },
                ],
            });
            const Publications = await Publication.findAll();
            const Companies = await Company.findAll();
            const Genres = await Genre.findAll();
            const ItemsRates = await ItemRate.findAll();
            const PublicationsComments = await PublicationComment.findAll();
            const Wishlists = await Wishlist.findAll();

            return res.json({
                Users,
                Items,
                Publications,
                Companies,
                Genres,
                ItemsRates,
                PublicationsComments,
                Wishlists
            });
        }
        catch (e) {
            return next(this.exceptionHandle(e));
        }
    }
}
const controller = new Controller();

export {
    controller
}