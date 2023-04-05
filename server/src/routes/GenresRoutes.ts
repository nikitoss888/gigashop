import {Router} from 'express';
import GenresController from "../controllers/Shop/GenresController";
import {checkWorker} from "../middleware/CheckRoleMiddleware";

const genresRouter = Router()

genresRouter.post('/', checkWorker, GenresController.create);
genresRouter.patch('/:id', checkWorker, GenresController.update);
genresRouter.delete('/:id', checkWorker, GenresController.delete);

genresRouter.get('/', GenresController.getAll);
genresRouter.get('/:id', GenresController.getOne);

module.exports = genresRouter