import {Router} from 'express';
import UserController from "../controllers/UserController";
import multerFactory from "./multerFactory";
import auth from "../middleware/AuthMiddleware";

const upload = multerFactory('users', ['image/jpeg', 'image/png', 'image/jpg']);

const userRouter = Router()

userRouter.get('/test', UserController.test);
userRouter.post('/register', upload.single('image'), UserController.register);
userRouter.post('/login', UserController.login);
userRouter.patch('/update', auth, upload.single('image'), UserController.update);
userRouter.get('/profile', auth, UserController.profile);
userRouter.get('/auth', auth, UserController.check);

module.exports = userRouter