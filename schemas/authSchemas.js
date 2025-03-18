import Joi from 'joi';
import { resendVerifyEmail } from '../controllers/authControllers.js';

export const authFields = {
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.empty': 'Password is required',
    }),
};

export const registerSchema = Joi.object({
    email: authFields.email.required().messages({ 'any.required': 'Email is required' }),
    password: authFields.password.required().messages({ 'any.required': 'Password is required' }),
});

export const loginSchema = Joi.object({
    email: authFields.email.required().messages({ 'any.required': 'Email is required' }),
    password: authFields.password.required().messages({ 'any.required': 'Password is required' }),
});

export const subscriptionSchema = Joi.object({
    subscription: Joi.string().valid('starter', 'pro', 'business').required().messages({
        'any.only': 'Subscription must be one of [starter, pro, business]',
        'string.empty': 'Subscription is required',
    }),
});

export const updateAvatarSchema = Joi.object({
    file: Joi.object({
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required().messages({
            'any.only': 'Only JPG, JPEG, and PNG formats are allowed',
            'any.required': 'File is required',
        }),
        size: Joi.number()
            .max(5 * 1024 * 1024)
            .required()
            .messages({
                'number.max': 'File size must be less than 5MB',
                'any.required': 'File is required',
            }),
    }),
});

export const resendVerifyEmailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'missing required field email',
    }),
});
