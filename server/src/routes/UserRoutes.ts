import {Request, Response} from "express";
import {Router} from 'express';
const userRouter = Router()

userRouter.post('/register');
userRouter.post('/login');
userRouter.get('/auth', (req: Request, res: Response): void => {
    res.json({message: 'Auth route works!'})
});

module.exports = userRouter