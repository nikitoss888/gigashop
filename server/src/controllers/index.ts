const ShopControllers = require('./Shop');
const UserControllers = require('./UserController');
const NewsControllers = require('./NewsController');

module.exports = exports = {
    ...ShopControllers,
    UserControllers,
    NewsControllers,
}