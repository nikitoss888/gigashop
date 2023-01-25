import {Router} from 'express';
const shopRouter = Router();

const CompaniesRoutes = require('./CompaniesRoutes');
const GenresRoutes = require('./GenresRoutes');
const ItemsRoutes = require('./ItemsRoutes');

shopRouter.use('/companies', CompaniesRoutes);
shopRouter.use('/genres', GenresRoutes);
shopRouter.use('/items', ItemsRoutes);

module.exports = shopRouter;