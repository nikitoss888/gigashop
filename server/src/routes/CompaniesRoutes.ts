import {Router} from 'express';
import CompaniesController from "../controllers/Shop/CompaniesController";
import {checkWorker} from "../middleware/CheckRoleMiddleware";
import multerFactory from "./multerFactory";

const upload = multerFactory('companies', ['image/jpeg', 'image/png', 'image/jpg']);

const companiesRouter = Router()

companiesRouter.post('/', checkWorker, upload.single('image'), CompaniesController.create);
companiesRouter.patch('/:id', checkWorker, upload.single('image'), CompaniesController.update);
companiesRouter.delete('/:id', checkWorker, CompaniesController.delete);

companiesRouter.get('/', CompaniesController.getAll);
companiesRouter.get('/:id', CompaniesController.getOne);

module.exports = companiesRouter

