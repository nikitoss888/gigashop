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

module.exports = userRouter