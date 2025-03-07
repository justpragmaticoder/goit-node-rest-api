import Contact from '../db/models/contact.js';
import HttpError from '../helpers/HttpError.js';

export const listContacts = async (userId) => {
    return await Contact.findAll({ where: { owner: userId } });
};

export const getOwnerContactById = async ({ owner, id }) => {
    return await Contact.findOne({ where: { id, owner } });
};

export const removeOwnerContact = async ({ owner, id }) => {
    const contact = await Contact.findOne({ where: { id, owner } });
    if (!contact) {
        return null;
    }
    await contact.destroy();
    return contact;
};

export const addOwnerContact = async ({ name, email, phone, owner }) => {
    return await Contact.create({ name, email, phone, owner });
};

export const updateOwnerContactData = async ({ owner, id, updates }) => {
    const contact = await Contact.findOne({ where: { id, owner } });
    if (!contact) {
        return null;
    }

    await contact.update(updates);
    return contact;
};

export const updateStatusContact = async (contactId, favorite) => {
    if (typeof favorite !== 'boolean') {
        throw HttpError(400, "Invalid request. 'favorite' must be a boolean value.");
    }

    const contact = await Contact.findByPk(contactId);
    if (!contact) {
        return null;
    }

    contact.favorite = favorite;
    await contact.save();
    return contact;
};
