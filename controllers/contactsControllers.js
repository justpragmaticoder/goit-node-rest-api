import {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact as updateContactData,
    updateStatusContact,
} from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';
import validateBody from '../helpers/validateBody.js';
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from '../schemas/contactsSchemas.js';

export const updateFavorite = [
    validateBody(updateFavoriteSchema),
    async (req, res, next) => {
        try {
            const { contactId } = req.params;
            const { favorite } = req.body;

            const updatedContact = await updateStatusContact(contactId, favorite);

            if (!updatedContact) {
                return next(HttpError(404, 'Not found'));
            }

            res.status(200).json(updatedContact);
        } catch (error) {
            next(HttpError(400, error.message));
        }
    },
];

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await listContacts();
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await getContactById(id);
        if (!contact) {
            return next(HttpError(404, 'Not found'));
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const removedContact = await removeContact(id);
        if (!removedContact) {
            return next(HttpError(404, 'Not found'));
        }
        res.status(200).json(removedContact);
    } catch (error) {
        next(error);
    }
};

export const createContact = [
    validateBody(createContactSchema),
    async (req, res, next) => {
        try {
            const { name, email, phone } = req.body;
            const newContact = await addContact(name, email, phone);
            res.status(201).json(newContact);
        } catch (error) {
            next(error);
        }
    },
];

export const updateContact = [
    validateBody(updateContactSchema),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedContact = await updateContactData(id, updates);
            if (!updatedContact) {
                return next(HttpError(404, 'Not found'));
            }
            res.status(200).json(updatedContact);
        } catch (error) {
            next(error);
        }
    },
];
