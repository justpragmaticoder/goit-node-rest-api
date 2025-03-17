import express from 'express';
import { register, login, logout, current, subscription, updateAvatar } from '../controllers/authControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const authRouter = express.Router();

authRouter.patch('/avatars', authMiddleware, upload.single('avatar'), updateAvatar);

authRouter.post('/register', register);

authRouter.post('/login', login);

authRouter.post('/logout', authMiddleware, logout);

authRouter.get('/current', authMiddleware, current);

authRouter.patch('/subscription', authMiddleware, subscription);

export default authRouter;
