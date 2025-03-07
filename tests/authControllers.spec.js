import { jest } from '@jest/globals';
import request from 'supertest';
import { sequelize } from '../db/config/db.js';
import '../db/models/user.js';
import { startServer } from '../app.js';
import { getRandomPort } from '../utils/random-port.js';

jest.setTimeout(10000);

/**
 * IMPORTANT!!! Be careful, it's kind a integration tests (works with real DB connection and application)
 */
describe('Auth API (Real Database)', () => {
    const defaultCredentials = { email: 'loginuser@example.com', password: 'password123' };
    let server;

    beforeAll(async () => {
        server = await startServer(getRandomPort());
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
        if (server && server.close) {
            await new Promise((resolve) => server.close(resolve));
        }
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(server).post('/api/auth/register').send(defaultCredentials);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', defaultCredentials.email);
            expect(res.body.user).toHaveProperty('subscription');
        });

        it('should return 409 if email is already in use', async () => {
            const user = { email: 'duplicate@example.com', password: 'password123' };
            // First registration succeeds
            await request(server).post('/api/auth/register').send(user);
            // Second registration attempt
            const res = await request(server).post('/api/auth/register').send(user);
            expect(res.status).toBe(409);
            expect(res.body).toEqual({ message: 'Email in use' });
        });
    });

    describe('POST /api/auth/login', () => {
        beforeAll(async () => {
            // Ensure a user exists for login tests.
            await request(server).post('/api/auth/register').send(defaultCredentials);
        });

        it('should login a user with valid credentials', async () => {
            const res = await request(server).post('/api/auth/login').send(defaultCredentials);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', defaultCredentials.email);
        });

        it('should return 401 with invalid credentials', async () => {
            const res = await request(server).post('/api/auth/login').send({ email: 'loginuser@example.com', password: 'wrongpassword' });
            expect(res.status).toBe(401);
            expect(res.body).toEqual({ message: 'Email or password is wrong' });
        });
    });

    describe('POST /api/auth/logout', () => {
        let logoutToken;

        beforeAll(async () => {
            // Ensure a user exists for logout testing.
            const credentials = { email: 'logoutuser@example.com', password: 'password123' };
            await request(server).post('/api/auth/register').send(credentials);
            const loginRes = await request(server).post('/api/auth/login').send(credentials);
            logoutToken = loginRes.body.token;
        });

        it('should logout the user', async () => {
            const res = await request(server).post('/api/auth/logout').set('Authorization', `Bearer ${logoutToken}`);
            expect(res.status).toBe(204);
        });
    });

    describe('GET /api/auth/current', () => {
        let currentToken;
        beforeAll(async () => {
            // Ensure a user exists for current endpoint testing.
            const credentials = { email: 'currentuser@example.com', password: 'password123' };
            await request(server).post('/api/auth/register').send(credentials);
            const loginRes = await request(server).post('/api/auth/login').send(credentials);
            currentToken = loginRes.body.token;
        });

        it('should return the current user details', async () => {
            const res = await request(server).get('/api/auth/current').set('Authorization', `Bearer ${currentToken}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('email', 'currentuser@example.com');
            expect(res.body).toHaveProperty('subscription');
        });
    });

    describe('GET /api/auth/subscription', () => {
        let subscriptionToken;

        beforeAll(async () => {
            const credentials = { email: 'subscriptionuser@example.com', password: 'password123' };
            await request(server).post('/api/auth/register').send(credentials);
            const loginRes = await request(server).post('/api/auth/login').send(credentials);
            subscriptionToken = loginRes.body.token;
        });

        it('should update and return user subscription', async () => {
            // Send the new subscription in the request body.
            const res = await request(server)
                .patch('/api/auth/subscription')
                .set('Authorization', `Bearer ${subscriptionToken}`)
                .send({ subscription: 'pro' });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('email', 'subscriptionuser@example.com');
            expect(res.body).toHaveProperty('subscription', 'pro');
        });
    });
});
