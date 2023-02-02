import {Router} from 'express';
import CompaniesController from "../../controllers/Shop/CompaniesController";
import multerFactory from "../multerFactory";
import checkRoles from "../../middleware/CheckRoleMiddleware";

const upload = multerFactory('companies', ['image/jpeg', 'image/png', 'image/jpg']);

const companiesRouter = Router()

companiesRouter.post('/', checkRoles(['ADMIN', 'MODERATOR']),
    upload.single('image'), CompaniesController.create);
companiesRouter.patch('/:id', checkRoles(['ADMIN', 'MODERATOR']),
    upload.single('image'), CompaniesController.update);
companiesRouter.delete('/:id', checkRoles(['ADMIN', 'MODERATOR']),
    CompaniesController.delete);
companiesRouter.get('/', CompaniesController.getAll);
companiesRouter.get('/:id', CompaniesController.getOne);
companiesRouter.get('/test', CompaniesController.test);

module.exports = companiesRouter