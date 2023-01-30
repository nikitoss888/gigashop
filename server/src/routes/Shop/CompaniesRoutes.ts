import {Router} from 'express';
import CompaniesController from "../../controllers/Shop/CompaniesController";
import multerFactory from "../multerFactory";

const upload = multerFactory('companies');

const companiesRouter = Router()

companiesRouter.post('/', upload.single('image'), CompaniesController.create);
companiesRouter.get('/', CompaniesController.getAll);
companiesRouter.get('/one/:id', CompaniesController.getOne);
companiesRouter.patch('/:id', upload.single('image'), CompaniesController.update);
companiesRouter.delete('/:id', CompaniesController.delete);
companiesRouter.get('/test', CompaniesController.test);

module.exports = companiesRouter