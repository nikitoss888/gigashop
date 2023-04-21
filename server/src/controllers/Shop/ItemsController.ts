import type {NextFunction, Request, Response} from 'express';
import Controller from '../Controller';
import Item, {getItem, getItems} from "../../models/Item";
import ApiError from "../../errors/ApiError";
import {User, Wishlist, ItemDevelopers, Genre, ItemGenre, Company} from "../../models";

const ITEMS_DIR = 'items';

type parseOutput = {
    name: string | undefined, description: string | undefined, sortBy: string | undefined,
    price: number | undefined, priceFrom: number | undefined, priceTo: number | undefined,
    releaseDate: Date | undefined, releaseDateFrom: Date | undefined, releaseDateTo: Date | undefined,
    amount: number | undefined, amountFrom: number | undefined, amountTo: number | undefined,
    discount: boolean | undefined, discountFrom: Date | undefined, discountTo: Date | undefined,
    discountSize: number | undefined, discountSizeFrom: number | undefined, discountSizeTo: number | undefined,
    descending: boolean | undefined, limit: number | undefined, page: number | undefined,
    includePublisher: boolean | undefined, publisherId: number | undefined,
    includeGenres: boolean | undefined, genresIds: number[] | undefined,
    includeDevelopers: boolean | undefined, developersIds: number[] | undefined,
    includeWishlisted: boolean | undefined, includeInCart: boolean | undefined,
    includeBought: boolean | undefined, includeRated: boolean | undefined,
    includeHidden: boolean | undefined, hide: boolean | undefined
}

class ItemsController extends Controller {
    static parseData({name, description, sortBy,
                         price, priceFrom, priceTo,
                         releaseDate, releaseDateFrom, releaseDateTo,
                         amount, amountFrom, amountTo,
                         discount, discountFrom, discountTo,
                         discountSize, discountSizeFrom, discountSizeTo,
                         desc, descending, limit, page,
                         includePublisher, publisherId,
                         includeGenres, genresIds,
                         includeDevelopers, developersIds,
                         includeWishlisted, includeInCart,
                         includeBought, includeRated, hide}: any): parseOutput {
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
            includePublisher, publisherId,
            includeGenres, genresIds,
            includeDevelopers, developersIds,
            includeWishlisted, includeInCart,
            includeBought, includeRated,
            includeHidden: hide, hide
        }
    }

    private static async _checkDevelopers(id?: number | string, developersIds?: number | string | (number | string)[]) {
        if (!id) throw ApiError.badRequest('Неправильний id товару');
        const item = await Item.findByPk(id);
        if (!item) throw ApiError.notFound('Товар не знайдено');

        if (!developersIds) throw ApiError.badRequest('Неправильні дані розробників');
        let developers: unknown[] | unknown | undefined;

        if (developersIds instanceof Array) developers = await Company.findAll({where: {id: developersIds}});
        else developers = await Company.findByPk(developersIds);

        if (!developers) throw ApiError.notFound('Розробника(-ів) не знайдено');
    }
    static async addDevelopers(id: number | string, developersIds: number | string | (number | string)[]) {
        let candidates = await ItemDevelopers.findAll({where: {itemId: id, companyId: developersIds}});
        if (candidates.length > 0) throw ApiError.badRequest('Товар вже має такого(-их) розробника(-ів)', candidates);

        await this._checkDevelopers(id, developersIds)
            .catch((e: unknown) => {
                throw e;
            });

        if (developersIds instanceof Array) {
            let data = developersIds.map((devId: number | string) => {
                return {itemId: id, companyId: devId};
            });
            return await ItemDevelopers.bulkCreate(data)
                .catch((e: unknown) => {
                    throw e;
                });
        }

        return await ItemDevelopers.create({itemId: id, companyId: developersIds})
            .catch((e: unknown) => {
                throw e;
            });
    }
    static async removeDevelopers(id: number | string, developersIds?: number | string | (number | string)[]) {
        let where: {itemId: number | string, companyId?: number | string | (number | string)[]} = {itemId: id};
        if (developersIds) where.companyId = developersIds;

        return await ItemDevelopers.destroy({where})
            .catch((e: unknown) => {
                throw e;
            });
    }
    static async setDevelopers(id: number | string, developersIds: number | string | (number | string)[]) {
        await this._checkDevelopers(id, developersIds)
            .catch((e: unknown) => {
                throw e;
            });

        await ItemDevelopers.destroy({where: {itemId: id}})
            .catch((e: unknown) => {
                throw e;
            });

        if (developersIds instanceof Array) {
            let data = developersIds.map((devId: number | string) => {
                return {itemId: id, companyId: devId};
            });

            return await ItemDevelopers.bulkCreate(data)
                .catch((e: unknown) => {
                    throw e;
                });
        }

        return await ItemDevelopers.create({itemId: id, companyId: developersIds})
            .catch((e: unknown) => {
                throw e;
            });
    }


    private static async _checkGenres(id?: number | string, genresIds?: number | string | (number | string)[]) {
        if (!id) throw ApiError.badRequest('Неправильний id товару');
        const item = await Item.findByPk(id);
        if (!item) throw ApiError.notFound('Товар не знайдено');

        if (!genresIds) throw ApiError.badRequest('Неправильні дані жанрів');
        let genres: unknown[] | unknown | undefined;

        if (genresIds instanceof Array) genres = await Genre.findAll({where: {id: genresIds}});
        else genres = await Genre.findByPk(genresIds);

        if (!genres) throw ApiError.notFound('Жанр(-и) не знайдено');
    }
    static async addGenres(id: number | string, genresIds: number | string | (number | string)[]) {
        let candidates = await ItemGenre.findAll({where: {itemId: id, genreId: genresIds}});
        if (candidates.length > 0) throw ApiError.badRequest('Товар вже має такий(-і) жанр(и)', candidates);

        await this._checkGenres(id, genresIds)
            .catch((e: ApiError | Error | unknown) => {
                throw e;
            });

        if (genresIds instanceof Array) {
            let data = genresIds.map((genreId: number | string) => {
                return {itemId: id, genreId: genreId};
            });
            return await ItemGenre.bulkCreate(data)
                .catch((e: unknown) => {
                    throw e;
                });
        }

        return await ItemGenre.create({itemId: id, genreId: genresIds})
            .catch((e: unknown) => {
                throw e;
            });
    }
    static async removeGenres(id: number | string, genresIds?: number | string | (number | string)[]) {
        let where: {itemId: number | string, genreId?: number | string | (number | string)[]} = {itemId: id};
        if (genresIds) where.genreId = genresIds;

        return await ItemGenre.destroy({where})
            .catch((e: unknown) => {
                throw e;
            });
    }
    static async setGenres(id: number | string, genresIds: number | string | (number | string)[]) {
        await this._checkGenres(id, genresIds)
            .catch((e: unknown) => {
                throw e;
            });

        await ItemGenre.destroy({where: {itemId: id}})
            .catch((e: unknown) => {
                throw e;
            });

        if (genresIds instanceof Array) {
            let data = genresIds.map((genreId: number | string) => {
                return {itemId: id, genreId: genreId};
            });
            return await ItemGenre.bulkCreate(data)
                .catch((e: unknown) => {
                    throw e;
                });
        }

        return await ItemGenre.create({itemId: id, genreId: genresIds})
            .catch((e: unknown) => {
                throw e;
            });
    }


    async create(req: Request, res: Response, next: NextFunction) {
        const files = req.files;

        if (files instanceof Array) {
            return next(ApiError.badRequest('Неправильна передача зображень'));
        }

        let imageName : string | undefined;
        let imagesNames: string[] | undefined;
        if (files) {
            const image = files.image[0];
            if (image) imageName = image.filename;

            const images = files.images;
            if (!images) imagesNames = [];
            else imagesNames = images.map((file: Express.Multer.File) => file.filename);
        }


        try {
            const { characteristics, developersIds, genresIds } = req.body;

            let {name, description,
                releaseDate, publisherId: company_publisherId,
                discount, discountFrom, discountTo,
                discountSize,
                price, amount} = ItemsController.parseData(req.body);

            let characteristicsParsed: Object | undefined = undefined;
            if (characteristics) {
                characteristicsParsed = JSON.parse(characteristics);
            }

            const item = await Item
                .create({name, description, price, releaseDate, amount,
                    discount, discountFrom, discountTo, discountSize, mainImage: imageName,
                    images: imagesNames, characteristics: characteristicsParsed, company_publisherId})
                .catch((e: unknown) => {
                    if (imageName) super.deleteFile(ITEMS_DIR, imageName);
                    if (imagesNames) {
                        imagesNames.forEach((name: string) => {
                            super.deleteFile(ITEMS_DIR, name);
                        });
                    }
                    return next(super.exceptionHandle(e));
                });

            if (!item) {
                if (imageName) super.deleteFile(ITEMS_DIR, imageName);
                if (imagesNames) {
                    imagesNames.forEach((name: string) => {
                        super.deleteFile(ITEMS_DIR, name);
                    });
                }
                return next(ApiError.badRequest('Не вдалося створити товар'));
            }

            if (!developersIds && !genresIds) {
                return res.json({message: "Товар успішно створено", item});
            }

            let err: unknown;
            let developersRes = developersIds ? await ItemsController.addDevelopers(item.id, developersIds)
                .catch((e: unknown) => {
                    err = e;
                }) : undefined;
            if (err) return next(super.exceptionHandle(err));

            let genresRes = genresIds ? await ItemsController.addGenres(item.id, genresIds)
                .catch((e: unknown) => {
                    err = e;
                }) : undefined;
            if (err) return next(super.exceptionHandle(err));

            return res.json({message: "Товар успішно створено", item, developers: developersRes, genres: genresRes});
        }
        catch (e: unknown) {
            if (imageName) super.deleteFile(ITEMS_DIR, imageName);
            if(imagesNames) {
                imagesNames.forEach((name: string) => {
                    super.deleteFile(ITEMS_DIR, name);
                });
            }
            return next(super.exceptionHandle(e));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const { name, description,
            releaseDate, releaseDateFrom, releaseDateTo,
            price, priceFrom, priceTo,
            amount, amountFrom, amountTo,
            discount, discountFrom, discountTo,
            discountSize, discountSizeFrom, discountSizeTo,
            descending, limit, page, sortBy,
            includePublisher, publisherId,
            includeGenres, genresIds,
            includeDevelopers, developersIds,
            includeWishlisted, includeInCart,
            includeBought, includeRated, includeHidden }
                = ItemsController.parseData(req.query);

        const items = await getItems(name, description,
            releaseDate, releaseDateFrom, releaseDateTo,
            price, priceFrom, priceTo,
            amount, amountFrom, amountTo,
            discount, discountFrom, discountTo,
            discountSize, discountSizeFrom, discountSizeTo,
            descending, limit, page, sortBy,
            includePublisher, publisherId,
            includeGenres, genresIds,
            includeDevelopers, developersIds,
            includeWishlisted, includeInCart,
            includeBought, includeRated, includeHidden)
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });

        if (!items) return next(ApiError.notFound('Товари не знайдено'));
        return res.json(items);
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const id = (new ItemsController()).parseNumber(req.params.id as string | undefined);
        if (!id) return next(ApiError.badRequest('Неправильний id товару'));

        const { includePublisher, includeGenres,
            includeDevelopers, includeWishlisted, includeInCart,
            includeBought, includeRated, includeHidden } = ItemsController.parseData(req.query);

        const item = await getItem(id, includePublisher, includeGenres,
            includeDevelopers, includeWishlisted, includeInCart,
            includeBought, includeRated, includeHidden)
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });
        if (!item) return next(ApiError.notFound('Товар не знайдено'));
        return res.json(item);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const { name, description, characteristics, developersIds, genresIds } = req.body;
            const { releaseDate, price,
                discount, discountFrom, discountTo,
                discountSize, publisherId, amount,
                hide} = ItemsController.parseData(req.body);
            const files = req.files;

            let characteristicsParsed: Object | undefined;
            if (characteristics) {
                characteristicsParsed = JSON.parse(characteristics);
            }

            let newImageName: string | undefined;
            let newImagesNames: string[] | undefined;
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

            const item = await Item.findByPk(id)
                .catch((e: unknown) => {
                    console.log(e);
                    return next(super.exceptionHandle(e));
                });
            if (!item) return next(ApiError.notFound('Товар не знайдено'));

            let oldImageName: string | undefined = item.mainImage;
            let oldImagesNames: string[] | undefined = item.images;

            if (name) item.name = name;
            if (description) item.description = description;
            if (releaseDate) item.releaseDate = releaseDate;
            if (price) item.price = price;
            if (amount) item.amount = amount;

            if (discount !== undefined) {
                item.discount = discount;

                if (discountFrom) item.discountFrom = discount ? discountFrom : null;
                if (discountTo) item.discountTo = discount ? discountTo : null;
                if (discountSize) item.discountSize = discount ? discountSize : null;
            }

            if (newImageName) item.mainImage = newImageName;
            if (newImagesNames) item.images = newImagesNames;
            if (characteristicsParsed) item.characteristics = characteristicsParsed;
            if (hide) item.hide = hide;
            if (publisherId && await Company.findByPk(publisherId)) item.company_publisherId = publisherId;

            let err: unknown;
            const result = await item.save()
                .catch((e: unknown) => {
                    if(newImageName) {
                        super.deleteFile(ITEMS_DIR, newImageName);
                    }
                    if(newImagesNames) {
                        newImagesNames.forEach((name: string) => {
                            super.deleteFile(ITEMS_DIR, name);
                        });
                    }
                    err = e;
                });
            if (err) return next(super.exceptionHandle(err));

            if (!result) {
                if (newImageName) {
                    super.deleteFile(ITEMS_DIR, newImageName);
                }
                if (newImagesNames) {
                    newImagesNames.forEach((name: string) => {
                        super.deleteFile(ITEMS_DIR, name);
                    });
                }
                return next(ApiError.badRequest('Не вдалося оновити товар'));
            }

            if (!developersIds && !genresIds) {
                return res.json({message: "Товар успішно відредаговано", result});
            }

            let developersRes = developersIds ? await ItemsController.setDevelopers(id, developersIds)
                .catch((e: unknown) => {
                    err = e;
                }) : undefined;
            if (err) return next(super.exceptionHandle(err));

            let genresRes = genresIds ? await ItemsController.setGenres(id, genresIds)
                .catch((e: unknown) => {
                    err = e;
                }) : undefined;
            if (err) return next(super.exceptionHandle(err));

            if(oldImageName && newImageName) {
                super.deleteFile(ITEMS_DIR, oldImageName);
            }
            if(oldImagesNames && newImagesNames) {
                oldImagesNames.forEach((name: string) => {
                    super.deleteFile(ITEMS_DIR, name);
                });
            }

            return res.json({message: "Товар успішно відредаговано", result,
                developers: developersRes, genres: genresRes});
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

            const result = await Item
                .destroy({where: {id}})
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            if (!result) return next(ApiError.badRequest('Не вдалося видалити товар'));

            if(oldImageName) super.deleteFile(ITEMS_DIR, oldImageName);
            if(oldImagesNames) {
                oldImagesNames.forEach((name: string) => {
                    super.deleteFile(ITEMS_DIR, name);
                });
            }

            await ItemsController.removeDevelopers(id)
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            await ItemsController.removeGenres(id)
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            return res.json({"message": "Товар успішно видалено"});
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async addGenres(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { genresIds } = req.body;

        let err: unknown;
        const result = await ItemsController.addGenres(id, genresIds)
            .catch((e: unknown) => {
                err = super.exceptionHandle(e);
            });
        if (err) return next(err);

        return res.json({message: "Жанр(-и) успішно додано товару", result});
    }

    async removeGenres(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { genresIds } = req.body;

        let err: unknown;
        const result = await ItemsController.removeGenres(id, genresIds)
            .catch((e: unknown) => {
                err = super.exceptionHandle(e);
            });
        if (err) return next(err);

        return res.json({message: "Жанр успішно видалено з товару", result});
    }

    async addDevelopers(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { developersIds } = req.body;

        let err: unknown;
        const result = await ItemsController.addDevelopers(id, developersIds)
            .catch((e: unknown) => {
                err = super.exceptionHandle(e);
            });
        if (err) return next(err);

        return res.json({message: "Розробника(-ів) успішно додано товару", result});
    }

    async removeDevelopers(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { developersIds } = req.body;

        let err: unknown;
        const result = await ItemsController.removeDevelopers(id, developersIds)
            .catch((e: unknown) => {
                err = super.exceptionHandle(e);
            });
        if (err) return next(err);

        return res.json({message: "Розробника(-ів) успішно видалено з товару", result});
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
        return res.json({message: `Items route works!`, request: {body: req.body, query: req.query}})
    }
}

export default new ItemsController();