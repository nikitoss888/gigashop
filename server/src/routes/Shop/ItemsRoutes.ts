import {Router} from 'express';
import ItemsController from "../../controllers/Shop/ItemsController";
import multerFactory from "../multerFactory";

const upload = multerFactory('items', ['image/jpeg', 'image/png', 'image/jpg']);

const itemsRouter = Router()

itemsRouter.post('/', upload.fields([
    {name: 'image', maxCount: 1},
    {name: 'images'}
]), ItemsController.create);
itemsRouter.get('/', ItemsController.getAll);
itemsRouter.get('/:id');
itemsRouter.patch('/:id');
itemsRouter.delete('/:id');
itemsRouter.get('/test', ItemsController.test);

module.exports = itemsRouter