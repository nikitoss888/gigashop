import {Router} from 'express';
import ItemsController from "../controllers/Shop/ItemsController";
import {checkWorker} from "../middleware/CheckRoleMiddleware";
import multerFactory from "./multerFactory";

const upload = multerFactory('items', ['image/jpeg', 'image/png', 'image/jpg']);

const itemsRouter = Router()

itemsRouter.post('/', checkWorker, upload.fields([{name: 'image', maxCount: 1}, {name: 'images'}]),
    ItemsController.create);
itemsRouter.patch('/:id', checkWorker, upload.fields([{name: 'image', maxCount: 1}, {name: 'images'}]),
    ItemsController.update);
itemsRouter.delete('/:id', checkWorker, ItemsController.delete);

itemsRouter.post('/:id/developers', checkWorker, ItemsController.addDevelopers);
itemsRouter.delete('/:id/developers', checkWorker, ItemsController.removeDevelopers);
itemsRouter.post('/:id/genres', checkWorker, ItemsController.addGenres);
itemsRouter.delete('/:id/genres', checkWorker, ItemsController.removeGenres);

itemsRouter.get('/', ItemsController.getAll);
itemsRouter.get('/:id', ItemsController.getOne);

module.exports = itemsRouter