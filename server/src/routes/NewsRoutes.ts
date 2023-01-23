import {Router} from 'express';
const newsRouter = Router()

newsRouter.post('/');
newsRouter.get('/');
newsRouter.get('/:id');
newsRouter.patch('/:id');
newsRouter.delete('/:id');

module.exports = newsRouter