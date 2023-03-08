import type {NextFunction, Request, Response} from 'express';
import Controller from '../Controller';
import Item, {getItem, getItems} from "../../models/Item";
import ApiError from "../../errors/ApiError";
import {User, Wishlist, ItemDevelopers, Genre, ItemGenre, Company} from "../../models";

const ITEMS_DIR = 'items';

class ItemsController extends Controller {
    static parseData({name, description, sortBy,
                         price, priceFrom, priceTo,
                         releaseDate, releaseDateFrom, releaseDateTo,
                         amount, amountFrom, amountTo,
                         discount, discountFrom, discountTo,
                         discountSize, discountSizeFrom, discountSizeTo,
                         desc, descending, limit, page, hide,
                         includePublisher, publisherId,
                         includeGenres, genresIds,
                         includeDevelopers, developersIds,
                         includeWishlisted, includeInCart,
                         includeBought, includeRated}: any): any {
        let Controller = new ItemsController();

        price = Controller.parseNumber(price as string | undefined);
        priceFrom = Controller.parseNumber(priceFrom as string | undefined);
        priceTo = Controller.parseNumber(priceTo as string | undefined);

        releaseDate = Controller.parseDate(releaseDate as string | undefined);
        releaseDateFrom = Controller.parseDate(releaseDateFrom as string | undefined);
        releaseDateTo = Controller.parseDate(releaseDateTo as string | undefined);

        amount = Controller.parseNumber(amount as string | undefined);
        amountFrom = Controller.parseNumber(amountFrom as string | undefined);
        amountTo = Controller.parseNumber(amountTo as string | undefined);

        discount = Controller.parseBoolean(discount as boolean | string | number | undefined);
        if (discount) {
            discountFrom = Controller.parseDate(discountFrom as string | undefined);
            discountTo = Controller.parseDate(discountTo as string | undefined);
            discountSize = Controller.parseNumber(discountSize as string | undefined);
            discountSizeFrom = Controller.parseNumber(discountSizeFrom as string | undefined);
            discountSizeTo = Controller.parseNumber(discountSizeTo as string | undefined);
        }

        let {descending: descendingParsed, limit: limitParsed, page: pageParsed} =
            Controller.parsePagination(desc as string | undefined, descending as string | undefined,
                limit as string | undefined, page as string | undefined);

        hide = Controller.parseBoolean(hide as boolean | string | number | undefined);

        if (includePublisher) {
            includePublisher = Controller.parseBoolean(includePublisher as boolean | string | number | undefined);
        }
        if (includeGenres) {
            includeGenres = Controller.parseBoolean(includeGenres as boolean | string | number | undefined);
        }
        if (includeDevelopers) {
            includeDevelopers = Controller.parseBoolean(includeDevelopers as boolean | string | number | undefined);
        }

        if (includeWishlisted) {
            includeWishlisted = Controller.parseBoolean(includeWishlisted as boolean | string | number | undefined);
        }
        if (includeInCart) {
            includeInCart = Controller.parseBoolean(includeInCart as boolean | string | number | undefined);
        }
        if (includeBought) {
            includeBought = Controller.parseBoolean(includeBought as boolean | string | number | undefined);
        }
        if (includeRated) {
            includeRated = Controller.parseBoolean(includeRated as boolean | string | number | undefined);
        }

        publisherId = Controller.parseNumber(publisherId as string | undefined);

        return {
            name, description, sortBy,
            price, priceFrom, priceTo,
            releaseDate, releaseDateFrom, releaseDateTo,
            amount, amountFrom, amountTo,
            discount, discountFrom, discountTo,
            discountSize, discountSizeFrom, discountSizeTo,
            descending: descendingParsed, limit: limitParsed, page: pageParsed,
            hide,
            includePublisher, publisherId,
            includeGenres, genresIds,
            includeDevelopers, developersIds,
            includeWishlisted, includeInCart,
            includeBought, includeRated
        }
    }

    private async _checkDevelopers(developersIds?: number | string | (number | string)[], id?: number | string) {
        if (!id) throw ApiError.badRequest('Неправильний id товару');
        const item = await Item.findByPk(id);
        if (!item) throw ApiError.notFound('Товар не знайдено');

        if (!developersIds) throw ApiError.badRequest('Неправильні дані розробників');
        let developers: unknown[] | unknown | undefined;

        if (developersIds instanceof Array) developers = await Company.findAll({where: {id: developersIds}});
        else developers = await Company.findByPk(developersIds);

        if (!developers) throw ApiError.notFound('Розробника(-ів) не знайдено');
    }

    private async _addDevelopers(developersIds: number | string | (number | string)[], itemId: number | string) {
        let candidates = await ItemDevelopers.findAll({where: {itemId: itemId, companyId: developersIds}});
        if (candidates.length > 0) throw ApiError.badRequest('Товар вже має такого(-их) розробника(-ів)');

        await this._checkDevelopers(developersIds, itemId)
            .catch((e: unknown) => {
                throw e;
            });

        let res;
        if (developersIds instanceof Array) {
            let data = developersIds.map((devId: number | string) => {
                return {itemId: itemId, companyId: devId};
            });
            res = await ItemDevelopers.bulkCreate(data)
                .catch((e: unknown) => {
                    throw e;
                });
        }
        else if (typeof developersIds === 'number' || typeof developersIds === 'string') {
            res = await ItemDevelopers.create({itemId: itemId, companyId: developersIds})
                .catch((e: unknown) => {
                    throw e;
                });
        }
        return res;
    }

    private async _removeDevelopers(developersIds: number | string | (number | string)[], itemId: number | string) {
        let candidates = await ItemDevelopers.findAll({where: {itemId: itemId, companyId: developersIds}});
        if (candidates.length === 0) throw ApiError.badRequest('Товар не має такого(-их) розробника(-ів)');

        await this._checkDevelopers(developersIds, itemId)
            .catch((e: unknown) => {
                throw e;
            });

        let res;
        if (developersIds instanceof Array) {
            res = await ItemDevelopers.destroy({where: {itemId: itemId, companyId: developersIds}})
                .catch((e: unknown) => {
                    throw e;
                });
        }
        else if (typeof developersIds === 'number' || typeof developersIds === 'string') {
            res = await ItemDevelopers.destroy({where: {itemId: itemId, companyId: developersIds}})
                .catch((e: unknown) => {
                    throw e;
                });
        }
        return res;
    }



    private async _checkGenres(genresIds?: number | string | (number | string)[], id?: number | string) {
        if (!id) throw ApiError.badRequest('Неправильний id товару');
        const item = await Item.findByPk(id);
        if (!item) throw ApiError.notFound('Товар не знайдено');

        if (!genresIds) throw ApiError.badRequest('Неправильні дані жанрів');
        let genres: unknown[] | unknown | undefined;

        if (genresIds instanceof Array) genres = await Genre.findAll({where: {id: genresIds}});
        else genres = await Genre.findByPk(genresIds);

        if (!genres) throw ApiError.notFound('Жанр(-и) не знайдено');
    }

    private async _addGenres(genresIds?: number | string | (number | string)[], itemId?: number | string) {
        let candidates = await ItemGenre.findAll({where: {itemId, genreId: genresIds}});
        if (candidates.length > 0) throw ApiError.badRequest('Товар вже має такий(-і) жанр(и)');

        await this._checkGenres(genresIds, itemId)
            .catch((e: unknown) => {
                throw e;
            });

        let res;
        if (genresIds instanceof Array) {
            let data = genresIds.map((genreId: number | string) => {
                return {itemId: itemId, genreId: genreId};
            });
            res = await ItemGenre.bulkCreate(data)
                .catch((e: unknown) => {
                    throw e;
                });
        }
        else if (typeof genresIds === 'number' || typeof genresIds === 'string') {
            res = await ItemGenre.create({itemId: itemId, genreId: genresIds})
                .catch((e: unknown) => {
                    throw e;
                });
        }
        return res;
    }

    private async _removeGenres(genresIds: number | string | (number | string)[] | undefined, itemId: number | string) {
        let candidates = await ItemGenre.findAll({where: {itemId: itemId, genreId: genresIds}});
        if (candidates.length === 0) throw ApiError.badRequest('Товар не має такого(-их) жанра(-ів)');

        await this._checkGenres(genresIds, itemId)
            .catch((e: unknown) => {
                throw e;
            });

        let res;
        if (genresIds instanceof Array) {
            res = await ItemGenre.destroy({where: {itemId: itemId, genreId: genresIds}});
        }
        else if (typeof genresIds === 'number' || typeof genresIds === 'string') {
            res = await ItemGenre.destroy({where: {itemId: itemId, genreId: genresIds}})
                .catch((e: unknown) => {
                    throw e;
                });
        }
        return res;
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const files = req.files;

        if (!files || files instanceof Array) {
            return next(ApiError.badRequest('Неправильна передача зображень'));
        }

        const image = files.image[0];
        if(!image) {
            return next(ApiError.badRequest('Необхідно завантажити головне зображення товару'));
        }
        let imageName = image.filename;

        const images = files.images;
        let imagesNames: string[] | undefined;
        if(!images) {
            imagesNames = [];
        }
        else imagesNames = images.map((file: Express.Multer.File) => file.filename);

        try {
            const { characteristics, developersIds, genresIds } = req.body;

            let {name, description, releaseDate, publisherId: company_publisherId,
                discount, discountFrom, discountTo, discountSize, price, amount} = ItemsController.parseData(req.body);

            let characteristicsParsed: Object | undefined = undefined;
            if (characteristics) {
                characteristicsParsed = JSON.parse(characteristics);
            }

            const item = await Item
                .create({name, description, price, releaseDate, amount,
                    discount, discountFrom, discountTo, discountSize, mainImage: imageName,
                    images: imagesNames, characteristics: characteristicsParsed, company_publisherId})
                .catch((e: unknown) => {
                    console.log(e);
                    super.deleteFile(ITEMS_DIR, imageName);
                    if(imagesNames) {
                        imagesNames.forEach((name: string) => {
                            super.deleteFile(ITEMS_DIR, name);
                        });
                    }
                    return next(super.exceptionHandle(e));
                });

            if (!item) {
                super.deleteFile(ITEMS_DIR, imageName);
                if(imagesNames) {
                    imagesNames.forEach((name: string) => {
                        super.deleteFile(ITEMS_DIR, name);
                    });
                }
                return next(ApiError.badRequest('Не вдалося створити товар'));
            }

            let developersRes;
            if (developersIds) {
                developersRes = await this._addDevelopers(developersIds, item.id)
                    .catch((e: unknown) => {
                        console.log(e);
                        return next(super.exceptionHandle(e));
                    });
            }

            let genresRes;
            if (genresIds) {
                genresRes = await this._addGenres(genresIds, item.id)
                    .catch((e: unknown) => {
                        console.log(e);
                        return next(super.exceptionHandle(e));
                    });
            }

            return res.json({message: "Товар успішно створено", item, devIdsRes: developersRes, genresRes});
        }
        catch (e: unknown) {
            console.log(e);
            super.deleteFile(ITEMS_DIR, imageName);
            if(imagesNames) {
                imagesNames.forEach((name: string) => {
                    super.deleteFile(ITEMS_DIR, name);
                });
            }
            return next(super.exceptionHandle(e));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const items = await getItems(ItemsController.parseData(req.query))
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });

        if (!items) return next(ApiError.notFound('Товари не знайдено'));
        res.json(items);
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const idParsed = (new ItemsController()).parseNumber(id as string | undefined);
        if (!idParsed) return next(ApiError.badRequest('Неправильний id товару'));

        const item = await getItem(idParsed, ...ItemsController.parseData(req.query))
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });
        if (!item) return next(ApiError.notFound('Товар не знайдено'));
        res.json(item);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const { name, description, characteristics, hide } = req.body;
            const { releaseDate, price, discount, discountFrom, discountTo,
                discountSize, publisherId } = ItemsController.parseData({name: req.body});
            const files = req.files;

            let hideParsed: boolean | undefined = super.parseBoolean(hide);

            let characteristicsParsed: Object | undefined = undefined;
            if (characteristics) {
                characteristicsParsed = JSON.parse(characteristics);
            }

            let newImageName: string | undefined = undefined;
            let newImagesNames: string[] | undefined = undefined;
            if (files instanceof Array) {
                return next(ApiError.badRequest('Неправильна передача зображень'));
            }
            if (files) {
                const image = files.image?.[0];
                if (image) {
                    newImageName = image.filename;
                }

                const images = files.images;
                if (images) {
                    newImagesNames = images.map((file: Express.Multer.File) => file.filename);
                }
            }

            const oldItem = await Item.findByPk(id);
            let oldImageName: string | undefined = oldItem?.mainImage;
            let oldImagesNames: string[] | undefined = oldItem?.images;

            const item = await Item.update(
                {name, description, price, releaseDate, discount, discountFrom, discountTo, discountSize,
                    mainImage: newImageName, images: newImagesNames, characteristics: characteristicsParsed,
                    company_publisherId: publisherId, hide: hideParsed}, {where: {id}})
                .catch((e: unknown) => {
                    console.log(e);
                    if(newImageName) {
                        super.deleteFile(ITEMS_DIR, newImageName);
                    }
                    if(newImagesNames) {
                        newImagesNames.forEach((name: string) => {
                            super.deleteFile(ITEMS_DIR, name);
                        });
                    }
                    return next(super.exceptionHandle(e));
                }
            );

            if (!item) {
                if(newImageName) {
                    super.deleteFile(ITEMS_DIR, newImageName);
                }
                if(newImagesNames) {
                    newImagesNames.forEach((name: string) => {
                        super.deleteFile(ITEMS_DIR, name);
                    });
                }
                return next(ApiError.badRequest('Не вдалося оновити товар'));
            }

            if(oldImageName && newImageName) {
                super.deleteFile(ITEMS_DIR, oldImageName);
            }
            if(oldImagesNames && newImagesNames) {
                oldImagesNames.forEach((name: string) => {
                    super.deleteFile(ITEMS_DIR, name);
                });
            }

            return res.json(item);
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            const oldItem = await Item.findByPk(id);
            let oldImageName: string | undefined = oldItem?.mainImage;
            let oldImagesNames: string[] | undefined = oldItem?.images;

            const item = await Item
                .destroy({where: {id}})
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            if (!item) return next(ApiError.badRequest('Не вдалося видалити товар'));

            if(oldImageName) super.deleteFile(ITEMS_DIR, oldImageName);
            if(oldImagesNames) {
                oldImagesNames.forEach((name: string) => {
                    super.deleteFile(ITEMS_DIR, name);
                });
            }
            return res.json(item);
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async addGenres(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { genresIds } = req.body;

        const result = await this._addGenres(genresIds, id)
            .catch((e: unknown) => {
                console.log(e);
                return next(super.exceptionHandle(e));
            });

        res.json({message: "Жанр(-и) успішно додано товару", result});
    }

    async removeGenres(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { genresIds } = req.body;

        const result = await this._removeGenres(genresIds, id)
            .catch((e: unknown) => {
                console.log(e);
                return next(super.exceptionHandle(e));
            });

        res.json({message: "Жанр успішно видалено з товару", result});
    }

    async addDevelopers(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { developersIds } = req.body;

        const result = await this._addDevelopers(developersIds, id)
            .catch((e: unknown) => {
                console.log(e);
                return next(super.exceptionHandle(e));
            });

        res.json({message: "Розробника(-ів) успішно додано товару", result});
    }

    async removeDevelopers(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { developersIds } = req.body;

        const result = await this._removeDevelopers(developersIds, id)
            .catch((e: unknown) => {
                console.log(e);
                return next(super.exceptionHandle(e));
            });

        res.json({message: "Розробника(-ів) успішно видалено з товару", result});
    }

    async addToWishList(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.query;
            const request_user = req.user;

            const item = await Item.findByPk(id);
            if (!item) return next(ApiError.notFound('Товар не знайдено'));

            const user = await User.findByPk(request_user.Id);
            if (!user) return next(ApiError.notFound('Користувача не знайдено'));

            const wishList = await Wishlist.findAll({where: {userId: user.id, itemId: id}});

            if (wishList.length > 0)
                return next(ApiError.badRequest('Товар вже є в списку бажань'));

            const wishListItem = await Wishlist.create({userId: user.id, itemId: id});

            return res.json({message: 'Товар успішно додано до списку бажань', wishListItem});
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async removeFromWishList(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.query;
            const request_user = req.user;

            const item = await Item.findByPk(id);
            if (!item) return next(ApiError.notFound('Товар не знайдено'));

            const user = await User.findByPk(request_user.Id);
            if (!user) return next(ApiError.notFound('Користувача не знайдено'));

            const wishList = await Wishlist.findAll({where: {userId: user.id, itemId: id}});

            if (wishList.length === 0)
                return next(ApiError.badRequest('Товару немає в списку бажань'));

            const wishListItem = await Wishlist.destroy({where: {userId: user.id, itemId: id}});

            return res.json({message: 'Товар успішно видалено зі списку бажань', wishListItem});
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async test(req: Request, res: Response) {
        res.json({message: `Items route works!`, request: {body: req.body, query: req.query}})
    }
}

export default new ItemsController();