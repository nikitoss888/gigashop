import {Router} from 'express';
import GenresController from "../../controllers/Shop/GenresController";

const genresRouter = Router()

genresRouter.post('/');
genresRouter.get('/');
genresRouter.get('/:id');
genresRouter.patch('/:id');
genresRouter.delete('/:id');
genresRouter.get('/test', GenresController.test);

module.exports = genresRouter