import {Router} from 'express';
const itemsRouter = Router()

itemsRouter.post('/');
itemsRouter.get('/');
itemsRouter.get('/:id');
itemsRouter.patch('/:id');
itemsRouter.delete('/:id');
itemsRouter.get('/test', (req, res) => {
    res.json({message: 'Route works!'})
});

module.exports = itemsRouter