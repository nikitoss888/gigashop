import type {NextFunction, Request, Response} from 'express';
import Controller from '../Controller';
import Item, {getItems} from "../../models/Item";
import ApiError from "../../errors/ApiError";

class ItemsController extends Controller {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, price, discount, discountFrom, discountTo, discountSize,
                company_publisherId, characteristics } = req.body;
            const files = req.files;

            let isDiscount = true;
            let discountFromParsed: Date | undefined = discountFrom;
            let discountToParsed: Date | undefined = discountTo;
            let discountSizeParsed: number | undefined = Number(discountSize);

            if (!super.parseBoolean(discount)) {
                isDiscount = false;
                discountFromParsed = undefined;
                discountToParsed = undefined;
                discountSizeParsed = undefined;
            }

            let characteristicsParsed: JSON | undefined = undefined;
            if (characteristics) {
                characteristicsParsed = JSON.parse(characteristics);
            }

            if(!files || files instanceof Array) {
                return next(ApiError.badRequest('Неправильний формат даних зображень'));
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
                .create({name, description, price, discount: isDiscount, discountFrom: discountFromParsed,
                    discountTo: discountToParsed, discountSize: discountSizeParsed, mainImage: imageName,
                    images: imagesNames, characteristics: characteristicsParsed, company_publisherId})
                .catch((e: unknown) => {
                    super.deleteFile('items', imageName);
                    if(imagesNames) {
                        imagesNames.forEach((name: string) => {
                            super.deleteFile('items', name);
                        });
                    }
                    return next(super.exceptionHandle(e));
                });

            return res.json(item);
        }
        catch (e: unknown) {
            console.log(e);
            return next(super.exceptionHandle(e));
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const { name, description, price, discount, discountFrom, discountTo, discountSize, publisherId,
            priceFrom, priceTo, desc, descending, limit, offset } = req.query;

        let priceParsed = super.parseNumber(price as string | undefined);
        let priceFromParsed = super.parseNumber(priceFrom as string | undefined);
        let priceToParsed = super.parseNumber(priceTo as string | undefined);

        let discountParsed = super.parseBoolean(discount as boolean | string | number | undefined);
        let discountFromParsed = super.parseDate(discountFrom as string | undefined);
        let discountToParsed = super.parseDate(discountTo as string | undefined);
        let discountSizeParsed = super.parseNumber(discountSize as string | undefined);

        let publisherIdParsed = super.parseNumber(publisherId as string | undefined);

        let descendingParsed: boolean | undefined;
        if (desc) descendingParsed = super.parseBoolean(desc as boolean | string | number | undefined);
        else descendingParsed = super.parseBoolean(descending as boolean | string | number | undefined);

        let limitParsed = super.parseNumber(limit as string | undefined);
        let offsetParsed = super.parseNumber(offset as string | undefined);

        let parameters: Parameters<typeof getItems> = [
            name as string | undefined,
            description as string | undefined,
            priceParsed,
            discountParsed, discountFromParsed, discountToParsed, discountSizeParsed,
            publisherIdParsed, priceFromParsed, priceToParsed, false,
            descendingParsed,
            limitParsed, offsetParsed
        ]

        const items = await getItems(...parameters)
            .catch((e: unknown) => {
                return next(super.exceptionHandle(e));
            });
        res.json(items);
    }

    async test(req: Request, res: Response) {
        res.json({message: `Items route works!`, request: {body: req.body, query: req.query}})
    }
}

export default new ItemsController();