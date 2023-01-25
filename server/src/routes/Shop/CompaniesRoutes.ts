import {Router} from 'express';
import CompaniesController from "../../controllers/Shop/CompaniesController";

const companiesRouter = Router()

companiesRouter.post('/');
companiesRouter.get('/');
companiesRouter.get('/:id');
companiesRouter.patch('/:id');
companiesRouter.delete('/:id');
companiesRouter.get('/test', CompaniesController.test);

module.exports = companiesRouter