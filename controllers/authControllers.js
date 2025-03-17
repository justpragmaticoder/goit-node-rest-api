import express from 'express';
import validateBody from '../helpers/validateBody.js';
import { registerSchema, loginSchema, subscriptionSchema, updateAvatarSchema } from '../schemas/authSchemas.js';
import { loginUser, registerUser, logoutUser, currentUser, updateUserSubscription, updateUserAvatar } from '../services/authServices.js';
import { catchAsyncUtil } from '../utils/catch-async.util.js';

const router = express.Router();

export const register = [
    validateBody(registerSchema),
    catchAsyncUtil(async (req, res, next) => {
        const newUser = await registerUser(req.body);
        res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription, avatarURL: newUser.avatarURL } });
    }),
];

export const login = [
    validateBody(loginSchema),
    catchAsyncUtil(async (req, res, next) => {
        const user = await loginUser(req.body);
        res.status(200).json({ token: user.token, user: { email: user.email, subscription: user.subscription } });
    }),
];

export const logout = [
    catchAsyncUtil(async (req, res, next) => {
        await logoutUser({ userId: req.user.id });
        res.status(204).send();
    }),
];

export const current = [
    catchAsyncUtil(async (req, res, next) => {
        const user = await currentUser({ userId: req.user.id });
        res.status(200).json({ email: user.email, subscription: user.subscription });
    }),
];

export const subscription = [
    validateBody(subscriptionSchema),
    catchAsyncUtil(async (req, res, next) => {
        const user = await updateUserSubscription({ id: req.user.id, subscription: req.body.subscription });
        res.status(200).json({ email: user.email, subscription: user.subscription });
    }),
];

export const updateAvatar = [
    validateBody(updateAvatarSchema),
    catchAsyncUtil(async (req, res) => {
        const avatarURL = await updateUserAvatar({ userId: req.user.id, file: req.file });

        res.json({ message: 'Avatar updated successfully', avatarURL });
    }),
];

export default router;
