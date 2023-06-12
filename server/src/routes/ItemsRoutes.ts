import {Router} from 'express';
import ItemsController from "../controllers/Shop/ItemsController";
import {checkWorker} from "../middleware/CheckRoleMiddleware";
import auth from "../middleware/AuthMiddleware";

const itemsRouter = Router()

itemsRouter.post('/', checkWorker, ItemsController.create);
itemsRouter.patch('/:id', checkWorker, ItemsController.update);
itemsRouter.delete('/:id', checkWorker, ItemsController.delete);

itemsRouter.post('/:id/toggleWishlist', auth, ItemsController.toggleWishList);
itemsRouter.post('/:id/toggleCart', auth, ItemsController.toggleCart);

itemsRouter.post('/:id/rate', auth, ItemsController.setRate);
itemsRouter.delete('/:id/rate', auth, ItemsController.removeRate);

itemsRouter.post('/:id/developers', checkWorker, ItemsController.addDevelopers);
itemsRouter.delete('/:id/developers', checkWorker, ItemsController.removeDevelopers);
itemsRouter.post('/:id/genres', checkWorker, ItemsController.addGenres);
itemsRouter.delete('/:id/genres', checkWorker, ItemsController.removeGenres);

itemsRouter.get('/', ItemsController.getAll);
itemsRouter.get('/:id', ItemsController.getOne);

module.exports = itemsRouter