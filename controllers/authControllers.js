import express from 'express';
import validateBody from '../helpers/validateBody.js';
import { registerSchema, loginSchema, subscriptionSchema } from '../schemas/authSchemas.js';
import { loginUser, registerUser, logoutUser, currentUser, updateUserSubscription } from '../services/authServices.js';
import { catchAsync } from '../utils/catch-async.js';

const router = express.Router();

export const register = [
    validateBody(registerSchema),
    catchAsync(async (req, res, next) => {
        const newUser = await registerUser(req.body);
        res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
    }),
];

export const login = [
    validateBody(loginSchema),
    catchAsync(async (req, res, next) => {
        const user = await loginUser(req.body);
        res.status(200).json({ token: user.token, user: { email: user.email, subscription: user.subscription } });
    }),
];

export const logout = [
    catchAsync(async (req, res, next) => {
        await logoutUser({ userId: req.user.id });
        res.status(204).send();
    }),
];

export const current = [
    catchAsync(async (req, res, next) => {
        const user = await currentUser({ userId: req.user.id });
        res.status(200).json({ email: user.email, subscription: user.subscription });
    }),
];

export const subscription = [
    validateBody(subscriptionSchema),
    catchAsync(async (req, res, next) => {
        const user = await updateUserSubscription({ id: req.user.id, subscription: req.body.subscription });
        res.status(200).json({ email: user.email, subscription: user.subscription });
    }),
];

export default router;
