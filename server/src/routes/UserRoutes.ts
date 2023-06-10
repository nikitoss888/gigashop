import {Router} from 'express';
import UserController from "../controllers/UserController";
import {checkAdmin} from "../middleware/CheckRoleMiddleware";
import auth from "../middleware/AuthMiddleware";

const userRouter = Router()

userRouter.get('/test', UserController.test);
userRouter.post('/register', UserController.register);
userRouter.post('/createModerator', checkAdmin, UserController.createModerator);
userRouter.post('/login', UserController.login);
userRouter.patch('/update', auth, UserController.update);
userRouter.get('/profile', auth, UserController.profile);
userRouter.get('/auth', auth, UserController.check);
userRouter.get('/', UserController.allUsers);
userRouter.post('/cart/setup', auth, UserController.setUpCart);
userRouter.post('/cart/success/:transactionId', UserController.buyCart);

module.exports = userRouter