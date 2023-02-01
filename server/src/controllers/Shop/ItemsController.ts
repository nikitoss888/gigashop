import type {NextFunction, Request, Response} from 'express';
import Controller from '../Controller';
import Item, {getItems} from "../../models/Item";
import ApiError from "../../errors/ApiError";

class ItemsController extends Controller {
    static parseData({price, priceFrom, priceTo,
                   releaseDate, releaseDateFrom, releaseDateTo,
                   discount, discountFrom, discountTo, discountSize,
                   publisherId,
                   desc, descending, limit, page, hide}: any): any {
        let Controller = new ItemsController();

        let priceParsed = Controller.parseNumber(price as string | undefined);
        let priceFromParsed = Controller.parseNumber(priceFrom as string | undefined);
        let priceToParsed = Controller.parseNumber(priceTo as string | undefined);

        let releaseDateParsed = Controller.parseDate(releaseDate as string | undefined);
        let releaseDateFromParsed = Controller.parseDate(releaseDateFrom as string | undefined);
        let releaseDateToParsed = Controller.parseDate(releaseDateTo as string | undefined);

        let discountParsed = Controller.parseBoolean(discount as boolean | string | number | undefined);
        let discountFromParsed: Date | undefined = undefined;
        let discountToParsed: Date | undefined = undefined;
        let discountSizeParsed: number | undefined = undefined;

        if (discountParsed) {
            discountFromParsed = Controller.parseDate(discountFrom as string | undefined);
            discountToParsed = Controller.parseDate(discountTo as string | undefined);
            discountSizeParsed = Controller.parseNumber(discountSize as string | undefined);
        }

        let publisherIdParsed = Controller.parseNumber(publisherId as string | undefined);

        let {descending: descendingParsed, limit: limitParsed, page: pageParsed} =
            Controller.parsePagination(desc as string | undefined, descending as string | undefined,
                limit as string | undefined, page as string | undefined);

        let hideParsed = Controller.parseBoolean(hide as boolean | string | number | undefined);

        return {
            price: priceParsed,
            priceFrom: priceFromParsed,
            priceTo: priceToParsed,
            releaseDate: releaseDateParsed,
            releaseDateFrom: releaseDateFromParsed,
            releaseDateTo: releaseDateToParsed,
            discount: discountParsed,
            discountFrom: discountFromParsed,
            discountTo: discountToParsed,
            discountSize: discountSizeParsed,
            publisherId: publisherIdParsed,
            descending: descendingParsed,
            limit: limitParsed,
            page: pageParsed,
            hide: hideParsed
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, company_publisherId, characteristics } = req.body;
            const files = req.files;

            let {releaseDate, discount: isDiscount, discountFrom: discountFromParsed, discountTo: discountToParsed,
                discountSize: discountSizeParsed, price} = ItemsController.parseData(req.body);

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
                .create({name, description, price, releaseDate, discount: isDiscount, discountFrom: discountFromParsed,
                    discountTo: discountToParsed, discountSize: discountSizeParsed, mainImage: imageName,
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
            discount, discountFrom, discountTo, discountSize,
            publisherId,
            descending, limit, page } = ItemsController.parseData(req.query);

        const items = await getItems(
            name as string | undefined, description as string | undefined,
            releaseDate, releaseDateFrom, releaseDateTo,
            price, priceFrom, priceTo,
            discount, discountFrom, discountTo, discountSize,
            publisherId,
            descending, limit, page, sortBy as string | undefined
        )
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });

        if (!items) return next(ApiError.notFound('Товари не знайдено'));
        res.json(items);
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const item = await Item.findByPk(id)
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

    async test(req: Request, res: Response) {
        res.json({message: `Items route works!`, request: {body: req.body, query: req.query}})
    }
}

export default new ItemsController();