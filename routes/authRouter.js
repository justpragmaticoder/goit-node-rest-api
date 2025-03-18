import express from 'express';
import { register, login, logout, current, subscription, updateAvatar, verifyEmail, resendVerifyEmail } from '../controllers/authControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const authRouter = express.Router();

authRouter.patch('/avatars', authMiddleware, upload.single('avatar'), updateAvatar);

authRouter.patch('/subscription', authMiddleware, subscription);

authRouter.post('/register', register);

authRouter.post('/login', login);

authRouter.post('/logout', authMiddleware, logout);

authRouter.post('/verify', resendVerifyEmail);

authRouter.get('/current', authMiddleware, current);

authRouter.get('/verify/:verificationToken', verifyEmail);

export default authRouter;
