import {Router} from 'express';
import NewsController from "../controllers/NewsController";
import auth from "../middleware/AuthMiddleware";

const newsRouter = Router()

newsRouter.post('/', auth, NewsController.create);
newsRouter.patch('/:id', auth, NewsController.update);
newsRouter.delete('/:id', auth, NewsController.delete);
newsRouter.get('/', NewsController.getAll);
newsRouter.get('/:id', NewsController.getOne);
newsRouter.get('/test', NewsController.test);

newsRouter.post('/:id/comment', auth, NewsController.setComment);
newsRouter.delete('/:id/comment', auth, NewsController.removeComment);
newsRouter.get('/:id/comments', NewsController.getComments);

module.exports = newsRouter