import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import * as contactsController from '../controllers/contactsControllers.js';
import * as contactsServices from '../services/contactsServices.js';
import fs from 'fs/promises';
import { server } from '../app.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, '../db/contacts.json');

async function getAllContactsFromDB() {
    try {
        const data = await fs.readFile(contactsPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading contacts: ', error.message);
        return [];
    }
}

async function restoreContactsInDB(contacts) {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

describe('Contacts Controllers', () => {
    let contactsList;

    beforeAll(async () => {
        contactsList = await getAllContactsFromDB();
    });

    afterEach(async () => {
        await restoreContactsInDB(contactsList);
    });

    afterAll(async () => {
        await server.close();
        await restoreContactsInDB(contactsList);
    });

    describe('getAllContacts', () => {
        it('should return all contacts', async () => {
            const res = await request(server).get('/api/contacts');

            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBeGreaterThan(0);
            res.body.forEach((contact) => {
                expect(contact).toHaveProperty('id', expect.any(String));
                expect(contact).toHaveProperty('name', expect.any(String));
                expect(contact).toHaveProperty('email', expect.any(String));
                expect(contact).toHaveProperty('phone', expect.any(String));
            });
        });
    });

    describe('getOneContact', () => {
        it('should return a contact by ID', async () => {
            const contactByIdResponse = await request(server).get(`/api/contacts/${contactsList[0].id}`);

            expect(contactByIdResponse.status).toBe(200);
            expect(contactByIdResponse.body).toEqual(contactsList[0]);
        });

        it('should return 404 if contact is not found', async () => {
            const res = await request(server).get('/api/contacts/123123123');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Not found' });
        });
    });

    describe('deleteContact', () => {
        it('should delete a contact by ID', async () => {
            const res = await request(server).delete(`/api/contacts/${contactsList[0].id}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(contactsList[0]);
        });

        it('should return 404 if contact is not found', async () => {
            const deletedContactResponse = await request(server).delete(`/api/contacts/${contactsList[0].id}`);
            const res = await request(server).delete(`/api/contacts/${deletedContactResponse.body.id}`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Not found' });
        });
    });

    describe('createContact', () => {
        it('should create a new contact', async () => {
            const newContact = { name: 'John Doe', email: 'john@example.com', phone: '1234567890' };
            const res = await request(server).post('/api/contacts').send(newContact);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                id: res.body.id,
                ...newContact,
            });
        });
    });

    describe('updateContact', () => {
        it('should update a contact by ID', async () => {
            const updates = { name: 'Jane Doe' };
            const res = await request(server).put(`/api/contacts/${contactsList[0].id}`).send(updates);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                ...res.body,
                ...updates,
            });
        });

        it('should return 404 if contact is not found', async () => {
            const res = await request(server).put('/api/contacts/8982192132').send({ name: 'Jane Doe' });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Not found' });
        });
    });
});
