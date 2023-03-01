import {Router} from 'express';
import ItemsController from "../../controllers/Shop/ItemsController";
import multerFactory from "../multerFactory";
import {checkWorker} from "../../middleware/CheckRoleMiddleware";

const upload = multerFactory('items', ['image/jpeg', 'image/png', 'image/jpg']);

const itemsRouter = Router()

itemsRouter.post('/', checkWorker, upload.fields([{name: 'image', maxCount: 1}, {name: 'images'}]),
    ItemsController.create);
itemsRouter.patch('/:id', checkWorker, upload.fields([{name: 'image', maxCount: 1}, {name: 'images'}]),
    ItemsController.update);
itemsRouter.delete('/:id', checkWorker, ItemsController.delete);
itemsRouter.get('/', ItemsController.getAll);
itemsRouter.get('/:id', ItemsController.getOne);
itemsRouter.get('/test', ItemsController.test);

module.exports = itemsRouter