import {Router} from 'express';
import ItemsController from "../controllers/Shop/ItemsController";
import NewsController from "../controllers/NewsController";

const commentsRouter = Router();

commentsRouter.use('/items', ItemsController.getAllRates);
commentsRouter.use('/news', NewsController.getAllComments);

module.exports = commentsRouter;