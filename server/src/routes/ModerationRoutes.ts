import {Router} from 'express';
import { checkWorker } from "../middleware/CheckRoleMiddleware";
import ItemsController from "../controllers/Shop/ItemsController";
import NewsController from "../controllers/NewsController";
import { controller } from "../controllers/Controller";

const moderationRouter = Router();

moderationRouter.patch('/news/:id', checkWorker, NewsController.toggleViolation);
moderationRouter.patch('/comments/:id', checkWorker, NewsController.toggleCommentViolation);

moderationRouter.patch('/rates/:id', checkWorker, ItemsController.toggleViolation);

moderationRouter.get('/statistics', checkWorker, controller.statistics);

module.exports = moderationRouter;