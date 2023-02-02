import {Router} from 'express';
import ItemsController from "../../controllers/Shop/ItemsController";
import multerFactory from "../multerFactory";
import checkRoles from "../../middleware/CheckRoleMiddleware";

const upload = multerFactory('items', ['image/jpeg', 'image/png', 'image/jpg']);

const itemsRouter = Router()

itemsRouter.post('/', checkRoles(['ADMIN', 'MODERATOR']),
    upload.fields([{name: 'image', maxCount: 1}, {name: 'images'}]),
    ItemsController.create);
itemsRouter.patch('/:id', checkRoles(['ADMIN', 'MODERATOR']),
    upload.fields([{name: 'image', maxCount: 1}, {name: 'images'}]),
    ItemsController.update);
itemsRouter.delete('/:id', checkRoles(['ADMIN', 'MODERATOR']), ItemsController.delete);
itemsRouter.get('/', ItemsController.getAll);
itemsRouter.get('/:id', ItemsController.getOne);
itemsRouter.get('/test', ItemsController.test);

module.exports = itemsRouter