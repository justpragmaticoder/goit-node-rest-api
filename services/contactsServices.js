import Contact from "../db/models/contact.js";
import HttpError from '../helpers/HttpError.js';

export const listContacts = async () => {
    return await Contact.findAll();
};

export const getContactById = async (contactId) => {
    return await Contact.findByPk(contactId);
};

export const removeContact = async (contactId) => {
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
        return null;
    }
    await contact.destroy();
    return contact;
};

export const addContact = async (name, email, phone) => {
    return await Contact.create({ name, email, phone });
};

export const updateContact = async (contactId, updates) => {
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
        return null;
    }

    await contact.update(updates);
    return contact;
};

export const updateStatusContact = async (contactId, favorite) => {
    if (typeof favorite !== 'boolean') {
        throw new HttpError(400, "Invalid request. 'favorite' must be a boolean value.");
    }

    const contact = await Contact.findByPk(contactId);
    if (!contact) {
        return null;
    }

    contact.favorite = favorite;
    await contact.save();
    return contact;
};
