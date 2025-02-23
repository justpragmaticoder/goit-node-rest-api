import { jest } from '@jest/globals';
import request from 'supertest';
import { sequelize } from '../db/config/db.js';
import Contact from '../db/models/contact.js';
import { app, server } from '../app.js'; // Import Express app

const mockContacts = [
    { name: 'Alice', email: 'alice@example.com', phone: '1234567890', favorite: false },
    { name: 'Bob', email: 'bob@example.com', phone: '0987654321', favorite: true },
];

jest.setTimeout(10000);

/**
 * IMPORTANT!!! Be careful, it's kind a integration tests (works with real DB connection and application)
 */
describe('Contacts API (Real Database)', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true }); // Reset database before tests
    });

    beforeEach(async () => {
        await Contact.bulkCreate(mockContacts);
    });

    afterEach(async () => {
        await Contact.destroy({ where: {} });
    });

    afterAll(async () => {
        await sequelize.close();
        await server.close();
    });

    describe('GET /api/contacts', () => {
        it('should return all contacts', async () => {
            const res = await request(app).get('/api/contacts');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body[0]).toHaveProperty('id');
            expect(res.body[0]).toHaveProperty('name', 'Alice');
        });
    });

    describe('GET /api/contacts/:id', () => {
        it('should return a contact by ID', async () => {
            const contact = await Contact.findOne();
            const res = await request(app).get(`/api/contacts/${contact.id}`);

            expect(res.status).toBe(200);
            expect(res.body.name).toBe(contact.name);
        });

        it('should return 404 if contact is not found', async () => {
            const res = await request(app).get('/api/contacts/999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Not found' });
        });
    });

    describe('DELETE /api/contacts/:id', () => {
        it('should delete a contact by ID', async () => {
            const contact = await Contact.findOne();
            const res = await request(app).delete(`/api/contacts/${contact.id}`);

            expect(res.status).toBe(200);
            expect(res.body.name).toBe(contact.name);
        });

        it('should return 404 if contact is not found', async () => {
            const res = await request(app).delete('/api/contacts/999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Not found' });
        });
    });

    describe('POST /api/contacts', () => {
        it('should create a new contact', async () => {
            const newContact = { name: 'Charlie', email: 'charlie@example.com', phone: '1112223333' };
            const res = await request(app).post('/api/contacts').send(newContact);

            expect(res.status).toBe(201);
            expect(res.body.name).toBe(newContact.name);
        });
    });

    describe('PUT /api/contacts/:id', () => {
        it('should update a contact', async () => {
            const contact = await Contact.findOne();
            const updates = { name: 'Updated Alice' };

            const res = await request(app).put(`/api/contacts/${contact.id}`).send(updates);

            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Updated Alice');
        });

        it('should return 404 if contact is not found', async () => {
            const res = await request(app).put('/api/contacts/999').send({ name: 'Updated Name' });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Not found' });
        });
    });

    describe('PATCH /api/contacts/:id/favorite', () => {
        it('should update the favorite status', async () => {
            const contact = await Contact.findOne();
            const res = await request(app).patch(`/api/contacts/${contact.id}/favorite`).send({ favorite: true });

            expect(res.status).toBe(200);
            expect(res.body.favorite).toBe(true);
        });

        it('should return 400 if favorite is missing', async () => {
            const contact = await Contact.findOne();
            const res = await request(app).patch(`/api/contacts/${contact.id}/favorite`).send({});

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('"favorite" is required');
        });

        it('should return 404 if contact is not found', async () => {
            const res = await request(app).patch('/api/contacts/999/favorite').send({ favorite: true });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Not found' });
        });
    });
});
