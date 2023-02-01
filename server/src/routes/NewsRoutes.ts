import {Router} from 'express';
import NewsController from "../controllers/NewsController";

const newsRouter = Router()

newsRouter.post('/', NewsController.create);
newsRouter.get('/', NewsController.getAll);
newsRouter.get('/:id', NewsController.getOne);
newsRouter.patch('/:id', NewsController.update);
newsRouter.delete('/:id', NewsController.delete);
newsRouter.get('/test', NewsController.test);

module.exports = newsRouter