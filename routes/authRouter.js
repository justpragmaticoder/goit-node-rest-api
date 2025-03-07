import express from 'express';
import { register, login, logout, current, subscription } from '../controllers/authControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', register);

authRouter.post('/login', login);

authRouter.post('/logout', authMiddleware, logout);

authRouter.get('/current', authMiddleware, current);

authRouter.patch('/subscription', authMiddleware, subscription);

export default authRouter;
