import {Router} from 'express';
const CompaniesRoutes = require('./CompaniesRoutes');
const GenresRoutes = require('./GenresRoutes');
const ItemsRoutes = require('./ItemsRoutes');
const UserRoutes = require('./UserRoutes');
const NewsRoutes = require('./NewsRoutes');

const ShopRoutes = Router();
ShopRoutes.use('/companies', CompaniesRoutes);
ShopRoutes.use('/genres', GenresRoutes);
ShopRoutes.use('/items', ItemsRoutes);

const mainRouter = Router();

mainRouter.use('/shop', ShopRoutes);
mainRouter.use('/user', UserRoutes);
mainRouter.use('/news', NewsRoutes);

module.exports = mainRouter;