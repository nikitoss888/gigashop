import {Router} from 'express';
const companiesRouter = Router()

companiesRouter.post('/');
companiesRouter.get('/');
companiesRouter.get('/:id');
companiesRouter.patch('/:id');
companiesRouter.delete('/:id');

module.exports = companiesRouter