import {Router} from 'express';
import ItemsController from "../../controllers/Shop/ItemsController";

const itemsRouter = Router()

itemsRouter.post('/');
itemsRouter.get('/');
itemsRouter.get('/:id');
itemsRouter.patch('/:id');
itemsRouter.delete('/:id');
itemsRouter.get('/test', ItemsController.test);

module.exports = itemsRouter