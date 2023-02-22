import type {NextFunction, Request, Response} from 'express';
import Controller from '../Controller';
import Item, {getItems} from "../../models/Item";
import ApiError from "../../errors/ApiError";
import { User, Wishlist, Company, ItemDevelopers, Genre } from "../../models";

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
                         includeDevelopers, developersIds }: any): any {
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

        publisherId = Controller.parseNumber(publisherId as string | undefined);
        if (genresIds) {
            if (typeof genresIds === 'string') genresIds = JSON.parse(genresIds);
            if (genresIds instanceof Array) genresIds = genresIds.map((id: string) => Controller.parseNumber(id));
        }

        if (developersIds) {
            if (typeof developersIds === 'string') developersIds = JSON.parse(developersIds);
            if (developersIds instanceof Array) developersIds = developersIds.map((id: string) => Controller.parseNumber(id));
        }

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
            includeDevelopers, developersIds
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, company_publisherId, characteristics, developersIds } = req.body;
            const files = req.files;

            let {releaseDate, discount, discountFrom, discountTo, discountSize, price, amount} = ItemsController.parseData(req.body);

            let characteristicsParsed: Object | undefined = undefined;
            if (characteristics) {
                characteristicsParsed = JSON.parse(characteristics);
            }

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

            const item = await Item
                .create({name, description, price, releaseDate, amount,
                    discount, discountFrom, discountTo, discountSize, mainImage: imageName,
                    images: imagesNames, characteristics: characteristicsParsed, company_publisherId})
                .catch((e: unknown) => {
                    console.log(e);
                    super.deleteFile('items', imageName);
                    if(imagesNames) {
                        imagesNames.forEach((name: string) => {
                            super.deleteFile('items', name);
                        });
                    }
                    return next(super.exceptionHandle(e));
                });

            if (!item) {
                super.deleteFile('items', imageName);
                if(imagesNames) {
                    imagesNames.forEach((name: string) => {
                        super.deleteFile('items', name);
                    });
                }
                return next(ApiError.badRequest('Не вдалося створити товар'));
            }

            if (!developersIds) {
                return res.json(item);
            }

            let developersIdsParsed: number[] | undefined = JSON.parse(developersIds);
            if (!developersIdsParsed) {
                return res.json(item);
            }

            for (const developerId of developersIdsParsed) {
                let res = await ItemDevelopers.create({itemId: item.id, companyId: developerId});
                if (!res) {
                    return next(ApiError.badRequest('Не вдалося створити запис про розробника'));
                }
            }

            return res.json(item);
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const { name, description, sortBy } = req.query;
        const { releaseDate, releaseDateFrom, releaseDateTo,
            price, priceFrom, priceTo,
            amount, amountFrom, amountTo,
            discount, discountFrom, discountTo,
            discountSize, discountSizeFrom, discountSizeTo,
            descending, limit, page,
            includePublisher, publisherId,
            includeGenres, genresIds,
            includeDevelopers, developersIds } = ItemsController.parseData(req.query);

        const items = await getItems(
            name as string | undefined, description as string | undefined,
            releaseDate, releaseDateFrom, releaseDateTo,
            price, priceFrom, priceTo,
            amount, amountFrom, amountTo,
            discount, discountFrom, discountTo,
            discountSize, discountSizeFrom, discountSizeTo,
            descending, limit, page, sortBy as string | undefined,
            includePublisher, publisherId,
            includeGenres, genresIds,
            includeDevelopers, developersIds
        )
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });

        if (!items) return next(ApiError.notFound('Товари не знайдено'));
        res.json(items);
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const item = await Item.findByPk(id, {
            include: [
                {
                    model: Company,
                    as: 'Publisher',
                    attributes: ['id', 'name'],
                },
                {
                    model: Genre,
                    as: 'Genres',
                },
                {
                    model: Company,
                    as: 'Developers',
                }
            ]})
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
                discountSize, publisherId } = ItemsController.parseData(req.body);
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
                        super.deleteFile('items', newImageName);
                    }
                    if(newImagesNames) {
                        newImagesNames.forEach((name: string) => {
                            super.deleteFile('items', name);
                        });
                    }
                    return next(super.exceptionHandle(e));
                }
            );

            if (!item) {
                if(newImageName) {
                    super.deleteFile('items', newImageName);
                }
                if(newImagesNames) {
                    newImagesNames.forEach((name: string) => {
                        super.deleteFile('items', name);
                    });
                }
                return next(ApiError.badRequest('Не вдалося оновити товар'));
            }

            if(oldImageName && newImageName) {
                super.deleteFile('items', oldImageName);
            }
            if(oldImagesNames && newImagesNames) {
                oldImagesNames.forEach((name: string) => {
                    super.deleteFile('items', name);
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

            if(oldImageName) super.deleteFile('items', oldImageName);
            if(oldImagesNames) {
                oldImagesNames.forEach((name: string) => {
                    super.deleteFile('items', name);
                });
            }
            return res.json(item);
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async addToWishList(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.query;
            const request_user = req.user;

            const item = await Item.findByPk(id);
            if (!item) return next(ApiError.notFound('Товар не знайдено'));

            const user = await User.findByPk(request_user.Id);
            if (!user) return next(ApiError.notFound('Користувача не знайдено'));

            const wishList = await Wishlist.findAll({where: {userId: user.id}});

            if (wishList && wishList.any((item: typeof Wishlist) => item.itemId === id))
                return next(ApiError.badRequest('Товар вже є в списку бажань'));

            const wishListItem = await Wishlist.create({userId: user.id, itemId: id});

            return res.json({message: 'Товар успішно додано до списку бажань', wishListItem});
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