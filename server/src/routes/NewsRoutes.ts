import {Router} from 'express';
import NewsController from "../controllers/NewsController";
import {checkWorker} from "../middleware/CheckRoleMiddleware";
import auth from "../middleware/AuthMiddleware";

const newsRouter = Router()

newsRouter.post('/', auth, NewsController.create);
newsRouter.patch('/:id', auth, NewsController.update);
newsRouter.delete('/:id', auth, NewsController.delete);
newsRouter.get('/', NewsController.getAll);
newsRouter.get('/:id', NewsController.getOne);
newsRouter.get('/test', NewsController.test);

newsRouter.post('/comment', auth, NewsController.createComment);
newsRouter.patch('/comment/:id', auth, NewsController.updateComment);
newsRouter.delete('/comment/:id', auth, NewsController.deleteComment);
newsRouter.get('/comments', NewsController.getComments);

newsRouter.patch('/violations/:id', checkWorker, NewsController.violation);
newsRouter.patch('/violations/comment/:id', checkWorker, NewsController.commentViolation);

module.exports = newsRouter