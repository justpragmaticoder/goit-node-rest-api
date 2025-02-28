import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
import request from 'supertest';
import { sequelize } from '../db/config/db.js';
import '../db/models/contact.js';
import '../db/models/user.js';
import { startServer } from '../app.js';
import { getRandomPort } from '../utils/random-port.js'; // Import Express app

const mockContacts = [
    { name: 'Alice', email: 'alice@example.com', phone: '1234567890', favorite: false, owner: null },
    { name: 'Bob', email: 'bob@example.com', phone: '0987654321', favorite: true, owner: null },
];

jest.setTimeout(10000);

/**
 * IMPORTANT!!! Be careful, it's kind a integration tests (works with real DB connection and application)
 */
describe('Contacts API (Real Database)', () => {
    let userModel;
    let contactModel;
    let server;
    let testUser;
    let token;

    beforeAll(async () => {
        server = await startServer(getRandomPort());
        await sequelize.sync({ force: true });

        userModel = sequelize.models.user;
        contactModel = sequelize.models.contact;

        // Create a test user and generate a valid token
        const password = await bcrypt.hash('testpass', 10);
        testUser = await userModel.create({ email: 'test@example.com', password, token: null });
        token = jwt.sign({ id: testUser.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        await testUser.update({ token });
    });

    beforeEach(async () => {
        await contactModel.bulkCreate(
            mockContacts.map((item) => {
                return { ...item, owner: testUser.id };
            }),
        );
    });

    afterEach(async () => {
        await contactModel.destroy({ where: {} });
    });

    afterAll(async () => {
        await sequelize.close();
        if (server && server.close) {
            await new Promise((resolve) => server.close(resolve));
        }
    });

    describe('GET /api/contacts', () => {
        it('should return all contacts', async () => {
            const res = await request(server).get('/api/contacts').set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body[0]).toHaveProperty('id');
            expect(res.body[0]).toHaveProperty('name', 'Alice');
        });
    });

    describe('GET /api/contacts/:id', () => {
        it('should return a contact by ID', async () => {
            const contact = await contactModel.findOne({ where: { owner: testUser.id } });
            const res = await request(server).get(`/api/contacts/${contact.id}`).set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.name).toBe(contact.name);
        });

        it('should return 404 if owner is valid but contact is not found', async () => {
            const res = await request(server).get('/api/contacts/999').set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Not found' });
        });

        it('should return 404 if contact is valid but owner is not', async () => {
            const contact = await contactModel.findOne({ where: { owner: testUser.id } });
            const res = await request(server).get(`/api/contacts/${contact.id}`).set('Authorization', `Bearer some_wrong_token`);

            expect(res.status).toBe(401);
            expect(res.body).toEqual({ message: 'Not authorized' });
        });
    });

    describe('DELETE /api/contacts/:id', () => {
        it('should delete a contact by ID', async () => {
            const contact = await contactModel.findOne({ where: { owner: testUser.id } });
            const res = await request(server).delete(`/api/contacts/${contact.id}`).set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.name).toBe(contact.name);
        });

        it('should return 404 if contact is not found', async () => {
            const res = await request(server).delete('/api/contacts/999').set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Not found' });
        });
    });

    describe('POST /api/contacts', () => {
        it('should create a new contact', async () => {
            const newContact = { name: 'Charlie', email: 'charlie@example.com', phone: '1112223333' };
            const res = await request(server).post('/api/contacts').send(newContact).set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(201);
            expect(res.body.name).toBe(newContact.name);
        });
    });

    describe('PUT /api/contacts/:id', () => {
        it('should update a contact', async () => {
            const contact = await contactModel.findOne();
            const updates = { name: 'Updated Alice' };

            const res = await request(server).put(`/api/contacts/${contact.id}`).send(updates).set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Updated Alice');
        });

        it('should return 404 if contact is not found', async () => {
            const res = await request(server).put('/api/contacts/999').send({ name: 'Updated Name' }).set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Not found' });
        });
    });

    describe('PATCH /api/contacts/:id/favorite', () => {
        it('should update the favorite status', async () => {
            const contact = await contactModel.findOne();
            const res = await request(server)
                .patch(`/api/contacts/${contact.id}/favorite`)
                .send({ favorite: true })
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.favorite).toBe(true);
        });

        it('should return 400 if favorite is missing', async () => {
            const contact = await contactModel.findOne();
            const res = await request(server).patch(`/api/contacts/${contact.id}/favorite`).send({}).set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('"favorite" is required');
        });

        it('should return 404 if contact is not found', async () => {
            const res = await request(server).patch('/api/contacts/999/favorite').send({ favorite: true }).set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: 'Not found' });
        });
    });
});
