import {Router} from 'express';
import NewsController from "../controllers/NewsController";
import auth from "../middleware/AuthMiddleware";

const newsRouter = Router()

newsRouter.post('/', NewsController.create);
newsRouter.patch('/:id', auth, NewsController.update);
newsRouter.delete('/:id', auth, NewsController.delete);
newsRouter.get('/', NewsController.getAll);
newsRouter.get('/:id', NewsController.getOne);
newsRouter.get('/test', NewsController.test);

module.exports = newsRouter