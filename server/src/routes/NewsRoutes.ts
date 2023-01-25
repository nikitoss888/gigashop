import {Router} from 'express';
import NewsController from "../controllers/NewsController";

const newsRouter = Router()

newsRouter.post('/');
newsRouter.get('/');
newsRouter.get('/:id');
newsRouter.patch('/:id');
newsRouter.delete('/:id');
newsRouter.get('/test', NewsController.test);

module.exports = newsRouter