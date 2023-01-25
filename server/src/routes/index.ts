import {Router} from 'express';
const mainRouter = Router();

const ShopRoutes = require('./Shop');
const UserRoutes = require('./UserRoutes');
const NewsRoutes = require('./NewsRoutes');

mainRouter.use('/shop', ShopRoutes);
mainRouter.use('/user', UserRoutes);
mainRouter.use('/news', NewsRoutes);

module.exports = mainRouter;