import {
    listContacts,
    removeOwnerContact,
    addOwnerContact,
    updateOwnerContactData,
    updateStatusContact,
    getOwnerContactById,
} from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';
import validateBody from '../helpers/validateBody.js';
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from '../schemas/contactsSchemas.js';
import { catchAsync } from '../utils/catch-async.js';

export const updateFavorite = [
    validateBody(updateFavoriteSchema),
    catchAsync(async (req, res, next) => {
        const { contactId } = req.params;
        const { favorite } = req.body;

        const updatedContact = await updateStatusContact(contactId, favorite);

        if (!updatedContact) {
            throw HttpError(404, 'Not found');
        }

        res.status(200).json(updatedContact);
    }),
];

export const getAllContacts = [
    catchAsync(async (req, res, next) => {
        const contacts = await listContacts(req.user.id);
        res.status(200).json(contacts);
    }),
];

export const getOneContact = [
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const contact = await getOwnerContactById({ owner: req.user.id, id });
        if (!contact) {
            throw HttpError(404, 'Not found');
        }
        return res.status(200).json(contact);
    }),
];

export const deleteContact = [
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const removedContact = await removeOwnerContact({ owner: req.user.id, id });
        if (!removedContact) {
            throw HttpError(404, 'Not found');
        }
        res.status(200).json(removedContact);
    }),
];

export const createContact = [
    validateBody(createContactSchema),
    catchAsync(async (req, res, next) => {
        const { name, email, phone } = req.body;
        const newContact = await addOwnerContact({ name, email, phone, owner: req.user.id });
        res.status(201).json(newContact);
    }),
];

export const updateContact = [
    validateBody(updateContactSchema),
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const updates = req.body;
        const updatedContact = await updateOwnerContactData({ owner: req.user.id, id, updates });
        if (!updatedContact) {
            throw HttpError(404, 'Not found');
        }
        res.status(200).json(updatedContact);
    }),
];
