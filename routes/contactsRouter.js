import express from 'express';
import { getAllContacts, getOneContact, deleteContact, createContact, updateContact, updateFavorite } from '../controllers/contactsControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const contactsRouter = express.Router();

contactsRouter.use(authMiddleware);

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', getOneContact);

contactsRouter.delete('/:id', deleteContact);

contactsRouter.post('/', createContact);

contactsRouter.put('/:id', updateContact);

contactsRouter.patch('/:contactId/favorite', updateFavorite);

export default contactsRouter;
