import {Router} from 'express';
import CompaniesController from "../controllers/Shop/CompaniesController";
import {checkWorker} from "../middleware/CheckRoleMiddleware";

const companiesRouter = Router()

companiesRouter.post('/', checkWorker, CompaniesController.create);
companiesRouter.patch('/:id', checkWorker, CompaniesController.update);
companiesRouter.delete('/:id', checkWorker, CompaniesController.delete);

companiesRouter.get('/', CompaniesController.getAll);
companiesRouter.get('/:id', CompaniesController.getOne);

module.exports = companiesRouter

