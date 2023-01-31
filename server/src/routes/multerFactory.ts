import multer, {FileFilterCallback} from "multer";
import {Request} from "express";
import path from "path";
import {randomUUID} from "crypto";
import ApiError from "../errors/ApiError";

type DestinationCallback = (error: Error | null, destination: string) => void

export default (dir: string, mimetypes: string[]) => {
    const storage = multer.diskStorage({
        // @ts-ignore
        // req is not used
        destination: function (req: Request, file: Express.Multer.File, cb: DestinationCallback) {
            const fs = require('fs');
            const destination = `../static/${dir}`;
            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination, {recursive: true});
            }
            cb(null, destination);
        },
        // @ts-ignore
        // req is not used
        filename: function (req: Request, file: Express.Multer.File, cb: DestinationCallback) {
            let imageType = path.extname(file.originalname);
            let imageName = randomUUID() + `${imageType}`;
            cb(null, imageName);
        }
    });

    // @ts-ignore
    // req is not used
    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (mimetypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(ApiError.badRequest('Неправильний формат зображення'));
        }
    }

    return multer({storage, fileFilter});
}