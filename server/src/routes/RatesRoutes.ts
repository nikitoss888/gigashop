import {Router} from 'express';
import { checkWorker } from "../middleware/CheckRoleMiddleware";
import ItemsController from "../controllers/Shop/ItemsController";
import NewsController from "../controllers/NewsController";

const commentsRouter = Router();

commentsRouter.use('/items', checkWorker, ItemsController.getAllRates);
commentsRouter.use('/news', checkWorker, NewsController.getAllComments);

module.exports = commentsRouter;