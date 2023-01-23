import {Router} from 'express';
const genresRouter = Router()

genresRouter.post('/');
genresRouter.get('/');
genresRouter.get('/:id');
genresRouter.patch('/:id');
genresRouter.delete('/:id');

module.exports = genresRouter