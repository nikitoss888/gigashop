import {Router} from 'express';
import GenresController from "../../controllers/Shop/GenresController";
import checkRoles from "../../middleware/CheckRoleMiddleware";

const genresRouter = Router()

genresRouter.post('/', checkRoles(['ADMIN', 'MODERATOR']), GenresController.create);
genresRouter.patch('/:id', checkRoles(['ADMIN', 'MODERATOR']), GenresController.update);
genresRouter.delete('/:id', checkRoles(['ADMIN', 'MODERATOR']), GenresController.delete);
genresRouter.get('/', GenresController.getAll);
genresRouter.get('/:id', GenresController.getOne);
genresRouter.get('/test', GenresController.test);

module.exports = genresRouter