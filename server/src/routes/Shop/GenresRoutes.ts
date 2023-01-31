import {Router} from 'express';
import GenresController from "../../controllers/Shop/GenresController";

const genresRouter = Router()

genresRouter.post('/', GenresController.create);
genresRouter.get('/', GenresController.getAll);
genresRouter.get('/:id', GenresController.getOne);
genresRouter.patch('/:id', GenresController.update);
genresRouter.delete('/:id', GenresController.delete);
genresRouter.get('/test', GenresController.test);

module.exports = genresRouter