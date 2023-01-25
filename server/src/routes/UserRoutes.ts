import {Router} from 'express';
import UserController from "../controllers/UserController";

const userRouter = Router()

userRouter.get(['', '/test'], UserController.test);
// userRouter.post('/register', UserController.register);
// userRouter.post('/login', UserController.login);
userRouter.get('/auth', UserController.check);

module.exports = userRouter