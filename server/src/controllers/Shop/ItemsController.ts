import type {NextFunction, Request, Response} from 'express';
import Controller from '../Controller';
import Item, {getItem, getItems} from "../../models/Item";
import ApiError from "../../errors/ApiError";
import { User, Wishlist, ItemDevelopers, Genre, ItemGenre, Company } from "../../models";
import ItemCart from "../../models/ItemCart";
import ItemRate, { getAllRates } from "../../models/ItemRate";
import { Op } from "sequelize";

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
    includeRated: boolean | undefined,
    includeHidden: boolean | undefined, hide: boolean | undefined, hidden: boolean | undefined
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
                         includeRated, hidden}: any): parseOutput {
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

        hidden = Controller.parseBoolean(hidden as boolean | string | number | undefined);

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
        if (includeRated) {
            includeRated = Controller.parseBoolean(includeRated as boolean | string | number | undefined);
        }

        publisherId = Controller.parseNumber(publisherId as string | undefined);
        if (typeof developersIds === 'string') {
            developersIds = [developersIds];
        }
        if (typeof genresIds === 'string') {
            genresIds = [genresIds];
        }

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
            includeRated,
            includeHidden: hidden, hide: hidden, hidden
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
        try {
            const { characteristics, developersIds, genresIds, mainImage, coverImage } = req.body;
            let { images } = req.body;
            if (images && !Array.isArray(images)) images = [images];

            let {name, description,
                releaseDate, publisherId: company_publisherId,
                discount, discountFrom, discountTo,
                discountSize,
                price, amount, hide } = ItemsController.parseData(req.body);

            let characteristicsParsed: Object | undefined = undefined;
            if (characteristics) {
                characteristicsParsed = JSON.parse(characteristics);
            }

            const item = await Item
                .create({name, description, price, releaseDate, amount,
                    discount, discountFrom, discountTo, discountSize, mainImage, coverImage,
                    images, characteristics: characteristicsParsed, company_publisherId, hide})
                .catch((e: unknown) => {
                    // ToDo: delete files
                    //
                    // if (mainImage) super.deleteFile(ITEMS_DIR, mainImage);
                    // if (coverImage) super.deleteFile(ITEMS_DIR, coverImage);
                    // if (images) {
                    //     images.forEach((name: string) => {
                    //         super.deleteFile(ITEMS_DIR, name);
                    //     });
                    // }
                    return next(super.exceptionHandle(e));
                });

            if (!item) {
                // ToDo: delete files
                //
                // if (mainImage) super.deleteFile(ITEMS_DIR, mainImage);
                // if (coverImage) super.deleteFile(ITEMS_DIR, coverImage);
                // if (images) {
                //     images.forEach((name: string) => {
                //         super.deleteFile(ITEMS_DIR, name);
                //     });
                // }
                return next(ApiError.badRequest('Не вдалося створити товар'));
            }

            if (!developersIds && !genresIds) {
                return res.json(item);
            }

            let err: unknown;
            developersIds ? await ItemsController.addDevelopers(item.id, developersIds)
                .catch((e: unknown) => {
                    err = e;
                }) : undefined;
            if (err) return next(super.exceptionHandle(err));

            genresIds ? await ItemsController.addGenres(item.id, genresIds)
                .catch((e: unknown) => {
                    err = e;
                }) : undefined;
            if (err) return next(super.exceptionHandle(err));

            return res.json(item);
        }
        catch (e: unknown) {
            // ToDo: delete files
            //
            // if (mainImage) super.deleteFile(ITEMS_DIR, mainImage);
            // if(images) {
            //     images.forEach((name: string) => {
            //         super.deleteFile(ITEMS_DIR, name);
            //     });
            // }
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
            includeRated, includeHidden
        } = ItemsController.parseData(req.query);

        const result = await getItems({
            name, description,
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
            includeRated, includeHidden
        })
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });
        if (!result) return next(ApiError.notFound('Товари не знайдено'));

        const { items, totalCount } = result;

        const companies = await Company.findAll({
            where: {
                hide: {
                    [Op.or]: [false, includeHidden]
                },
            },
        });

        const genres = await Genre.findAll({
            where: {
                hide: {
                    [Op.or]: [false, includeHidden]
                },
            },
        });

        if (!items) return next(ApiError.notFound('Товари не знайдено'));
        return res.json({ items, totalCount, companies, genres });
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const id = (new ItemsController()).parseNumber(req.params.id as string | undefined);
        if (!id) return next(ApiError.badRequest('Неправильний id товару'));

        const { includePublisher,
            includeGenres,
            includeDevelopers,
            includeWishlisted,
            includeInCart,
            includeRated
        } = ItemsController.parseData(req.query);
        const includeHidden = super.parseBoolean(req.query.includeHidden as string | undefined) || false;

        const item = await getItem({
            id, includePublisher, includeGenres,
            includeDevelopers, includeWishlisted, includeInCart,
            includeRated, includeHidden
        })
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });
        if (!item) return next(ApiError.notFound('Товар не знайдено'));
        return res.json(item);
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const { name, description, characteristics, developersIds, genresIds, mainImage, coverImage } = req.body;
            const { releaseDate, price,
                discount, discountFrom, discountTo,
                discountSize, publisherId, amount,
                hide} = ItemsController.parseData(req.body);

            let { images } = req.body;
            if (images && !Array.isArray(images)) images = [images];

            let characteristicsParsed: Object | null | undefined;
            if (characteristics !== undefined) {
                characteristicsParsed = JSON.parse(characteristics);
            }
            else if (characteristics === null) {
                characteristicsParsed = null;
            }
            console.log({ characteristics, characteristicsParsed });

            const item = await Item.findByPk(id)
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });
            if (!item) return next(ApiError.notFound('Товар не знайдено'));

            // let oldMainName: string | undefined = item.mainImage;
            // let oldImages: string[] | undefined = item.images;
            // let oldCoverImage: string | undefined = item.coverImage;

            if (name) item.name = name;
            if (description) item.description = description;
            if (releaseDate) item.releaseDate = releaseDate;
            if (price !== undefined && price >= 0) item.price = price;
            if (amount !== undefined && amount >= 0) {
                item.amount = amount;
            }
            if (mainImage) item.mainImage = mainImage;
            if (images) item.images = images;
            if (coverImage) item.coverImage = coverImage;

            if (discount !== undefined) {
                item.discount = discount;

                if (discountFrom) item.discountFrom = discount ? discountFrom : null;
                if (discountTo) item.discountTo = discount ? discountTo : null;
                if (discountSize !== undefined) item.discountSize = discount ? discountSize : null;
            }
            if (characteristicsParsed !== undefined) item.characteristics = characteristicsParsed;
            if (hide !== undefined) item.hide = hide;
            if (publisherId && await Company.findByPk(publisherId)) item.company_publisherId = publisherId;

            let err: unknown;
            const result = await item.save()
                .catch((e: unknown) => {
                    // ToDo: delete files
                    //
                    // if(mainImage) super.deleteFile(ITEMS_DIR, mainImage);
                    // if(coverImage) super.deleteFile(ITEMS_DIR, coverImage);
                    // if(images) {
                    //     images.forEach((name: string) => {
                    //         super.deleteFile(ITEMS_DIR, name);
                    //     });
                    // }
                    err = e;
                });
            if (err) return next(super.exceptionHandle(err));

            if (!result) {
                // ToDo: delete files
                //
                // if (mainImage) super.deleteFile(ITEMS_DIR, mainImage);
                // if (coverImage) super.deleteFile(ITEMS_DIR, coverImage);
                // if (images) {
                //     images.forEach((name: string) => {
                //         super.deleteFile(ITEMS_DIR, name);
                //     });
                // }
                return next(ApiError.badRequest('Не вдалося оновити товар'));
            }

            if (!developersIds && !genresIds) {
                return res.json(result);
            }

            developersIds ? await ItemsController.setDevelopers(id, developersIds)
                .catch((e: unknown) => {
                    err = e;
                }) : undefined;
            if (err) return next(super.exceptionHandle(err));

            genresIds ? await ItemsController.setGenres(id, genresIds)
                .catch((e: unknown) => {
                    err = e;
                }) : undefined;
            if (err) return next(super.exceptionHandle(err));

            // ToDo: delete files
            //
            // if(oldMainName && mainImage) super.deleteFile(ITEMS_DIR, oldMainName);
            // if(oldCoverImage && coverImage) super.deleteFile(ITEMS_DIR, oldCoverImage);
            // if(oldImages && images) {
            //     oldImages.forEach((name: string) => {
            //         super.deleteFile(ITEMS_DIR, name);
            //     });
            // }

            return res.json(item);
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            const oldItem = await Item.findByPk(id);
            // let oldImageName: string | undefined = oldItem?.mainImage;
            // let oldImagesNames: string[] | undefined = oldItem?.images;
            // let oldCoverImage: string | undefined = oldItem?.coverImage;

            const result = await oldItem?.destroy()
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            if (!result) return next(ApiError.badRequest('Не вдалося видалити товар'));

            // ToDo: delete files
            //
            // if(oldImageName) super.deleteFile(ITEMS_DIR, oldImageName);
            // if(oldCoverImage) super.deleteFile(ITEMS_DIR, oldCoverImage);
            // if(oldImagesNames) {
            //     oldImagesNames.forEach((name: string) => {
            //         super.deleteFile(ITEMS_DIR, name);
            //     });
            // }

            await ItemsController.removeDevelopers(id)
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            await ItemsController.removeGenres(id)
                .catch((e: unknown) => {
                    return next(super.exceptionHandle(e));
                });

            return res.json({ ok: true });
        }
        catch (e: unknown) {
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

            return res.json(wishListItem);
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

            const wishList = await Wishlist.findOne({where: {userId: user.id, itemId: id}});

            if (!wishList)
                return next(ApiError.badRequest('Товару немає в списку бажань'));

            await Wishlist.destroy({where: {userId: user.id, itemId: id}});
            return res.json({ ok: true });
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async toggleWishList(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const request_user = req.user;

            const item = await Item.findByPk(id);
            if (!item) return next(ApiError.notFound('Товар не знайдено'));
            if (item.hide) return next(ApiError.badRequest('Товар не доступний'));

            const user = await User.findByPk(request_user.id);
            if (!user) return next(ApiError.notFound('Користувача не знайдено'));

            const wishList = await Wishlist.findOne({where: {userId: user.id, itemId: id}});
            if (wishList) {
                await Wishlist.destroy({where: {userId: user.id, itemId: id}});
                return res.json({message: 'Товар успішно видалено зі списку бажань', ok: true});
            }
            await Wishlist.create({userId: user.id, itemId: id});
            return res.json({message: 'Товар успішно додано до списку бажань', ok: true});
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async toggleCart(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const request_user = req.user;

            const item = await Item.findByPk(id);
            if (!item) return next(ApiError.notFound('Товар не знайдено'));
            if (item.hide) return next(ApiError.badRequest('Товар не доступний для покупки'));

            const user = await User.findByPk(request_user.id);
            if (!user) return next(ApiError.notFound('Користувача не знайдено'));

            const itemCart = await ItemCart.findOne({where: {userId: user.id, itemId: id}});
            if (itemCart) {
                await ItemCart.destroy({where: {userId: user.id, itemId: id}});
                return res.json({message: 'Товар успішно видалено з кошика', ok: true});
            }

            if (item.amount <= 0) return next(ApiError.badRequest('Товар скінчився в наявності'));
            await ItemCart.create({userId: user.id, itemId: id});
            return res.json({message: 'Товар успішно додано до кошика', ok: true});
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async getAllRates(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                sortBy
            } = req.query;
            let descending = super.parseBoolean(req.query.desc as string);
            if (descending === undefined) descending = super.parseBoolean(req.query.descending as string) || false;
            const limit = super.parseNumber(req.query.limit as string) || 12;
            const page = super.parseNumber(req.query.page as string) || 1;

            const result = await getAllRates({sortBy: sortBy as string, descending, limit, page});
            if (!result) return next(ApiError.notFound('Коментарів не знайдено'));

            const { totalCount, rates } = result;

            if(!rates) return next(ApiError.notFound('Коментарів не знайдено'));
            return res.json({totalCount, rates});
        }
        catch (e: unknown) {
            return next(super.exceptionHandle(e));
        }
    }

    async setRate(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const rate = super.parseNumber(req.body.rate as string);

            if (!req.user) return next(ApiError.unauthorized('Необхідна авторизація'));
            const user = await User.findByPk(req.user.id);
            if (!user) return next(ApiError.notFound('Користувача не знайдено'));

            const item = await Item.findByPk(id);
            if (!item) return next(ApiError.notFound('Товар не знайдено'));
            if (item.hide) return next(ApiError.badRequest('Товар не доступний'));

            const itemRate = await ItemRate.findOne({where: {userId: req.user.id, itemId: id}});

            if (!itemRate) {
                if (!rate) return next(ApiError.badRequest('Необхідно вказати оцінку'));
                const newRate = await ItemRate.create({userId: req.user.id, itemId: id, content, rate});
                return res.json({message: 'Відгук успішно додано', rate: newRate, user });
            }

            if (content) itemRate.content = content;
            if (rate) itemRate.rate = rate;
            await itemRate.save();

            return res.json({message: 'Відгук успішно оновлено', rate: itemRate, user });
        }
        catch (e) {
            return next(super.exceptionHandle(e));
        }
    }

    async removeRate(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (!req.user) return next(ApiError.unauthorized('Необхідна авторизація'));
            const user = await User.findByPk(req.user.id);
            if (!user) return next(ApiError.notFound('Користувача не знайдено'));

            const itemRate = await ItemRate.findOne({where: {userId: req.user.id, itemId: id}});
            if (!itemRate) return next(ApiError.notFound('Відгук не знайдено'));

            await ItemRate.destroy({where: {userId: req.user.id, itemId: id}});
            return res.json({message: 'Відгук успішно видалено', ok: true });
        }
        catch (e) {
            return next(super.exceptionHandle(e));
        }
    }

    async toggleViolation(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { violation, violation_reason } = req.body;

            let violationParsed = super.parseBoolean(violation as string | undefined) || false;

            const rate = await ItemRate.findByPk(id);
            if (!rate) return next(ApiError.notFound('Товар не знайдено'));

            if (!violationParsed) {
                rate.violation_reason = null;
                rate.hide = false;
                rate.violation = false;
            }
            else {
                rate.violation_reason = violation_reason;
                rate.hide = true;
                rate.violation = true;
            }

            const result = await rate.save();

            return res.json({message: 'Статус порушення успішно оновлено', result });
        }
        catch (e) {
            return next(super.exceptionHandle(e));
        }
    }

    async test(req: Request, res: Response) {
        return res.json({message: `Items route works!`, request: {body: req.body, query: req.query}})
    }
}

export default new ItemsController();