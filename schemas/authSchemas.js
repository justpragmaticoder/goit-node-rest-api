import Joi from 'joi';

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
