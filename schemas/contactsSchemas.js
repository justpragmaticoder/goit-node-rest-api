import Joi from 'joi';

// Base schema for contact fields
const contactFields = {
    name: Joi.string().min(2).max(50).messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must be at most 50 characters',
    }),
    email: Joi.string().email().messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Email must be a valid email address',
    }),
    phone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .messages({
            'string.base': 'Phone must be a string',
            'string.empty': 'Phone cannot be empty',
            'string.pattern.base': 'Phone must be a valid international phone number',
        }),
};

// Create contact schema (all fields required)
export const createContactSchema = Joi.object({
    name: contactFields.name.required().messages({ 'any.required': 'Name is required' }),
    email: contactFields.email.required().messages({ 'any.required': 'Email is required' }),
    phone: contactFields.phone.required().messages({ 'any.required': 'Phone is required' }),
});

// Update contact schema (all fields optional, but at least one must be present)
export const updateContactSchema = Joi.object(contactFields).min(1).messages({ 'object.min': 'Body must have at least one field' });
