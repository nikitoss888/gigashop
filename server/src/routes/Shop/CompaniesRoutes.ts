import {Router, Request} from 'express';
import CompaniesController from "../../controllers/Shop/CompaniesController";
import path from "path";
import {randomUUID} from "crypto";
import multer, { FileFilterCallback } from "multer";
import ApiError from "../../errors/ApiError";

type DestinationCallback = (error: Error | null, destination: string) => void

const storage = multer.diskStorage({
    // @ts-ignore
    // req is not used
    destination: function (req: Request, file: Express.Multer.File, cb: DestinationCallback) {
        const fs = require('fs');
        const dir = '../static/companies';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }

        cb(null, dir);
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
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(ApiError.badRequest('Неправильний формат зображення'));
    }
}

const upload = multer({storage, fileFilter});

const companiesRouter = Router()

companiesRouter.post('/', upload.single('image'), CompaniesController.create);
companiesRouter.get('/', CompaniesController.getAll);
companiesRouter.get('/:id', CompaniesController.getOne);
companiesRouter.patch('/:id', CompaniesController.update);
companiesRouter.delete('/:id');
companiesRouter.get('/test', CompaniesController.test);

module.exports = companiesRouter