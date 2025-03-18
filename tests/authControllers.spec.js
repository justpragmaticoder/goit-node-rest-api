import path from 'path';
import { jest } from '@jest/globals';
import request from 'supertest';
import { sequelize } from '../db/config/db.js';
import '../db/models/user.js';
import { startServer } from '../app.js';
import { getRandomPort } from '../utils/random-port.util.js';

jest.setTimeout(10000);

/**
 * IMPORTANT!!! Be careful, it's kind a integration tests (works with real DB connection and application)
 */
describe('Auth API (Real Database)', () => {
    const defaultCredentials = { email: 'loginuser@example.com', password: 'password123' };
    let userModel;
    let server;

    beforeAll(async () => {
        server = await startServer(getRandomPort());
        await sequelize.sync({ force: true });

        userModel = sequelize.models.user;
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
            expect(res.body.user).toHaveProperty('avatarURL');
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
        beforeEach(async () => {
            // Ensure a user exists for login tests.
            await request(server).post('/api/auth/register').send(defaultCredentials);
        });

        afterEach(async () => {
            await userModel.destroy({ where: { email: defaultCredentials.email } });
        });

        it('should login a user with valid credentials', async () => {
            await userModel.update(
              { verify: true },
              {
                  where: { email: defaultCredentials.email },
              },
            );

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

        it('should return 403 with valid credentials but not verified email', async () => {
            const res = await request(server).post('/api/auth/login').send({ email: defaultCredentials.email, password: defaultCredentials.password });
            expect(res.status).toBe(403);
            expect(res.body).toEqual({ message: 'Email is not verified' });
        });
    });

    describe('POST /api/auth/logout', () => {
        let logoutToken;

        beforeAll(async () => {
            // Ensure a user exists for logout testing.
            const credentials = { email: 'logoutuser@example.com', password: 'password123' };
            await request(server).post('/api/auth/register').send(credentials);

            await userModel.update(
              { verify: true },
              {
                  where: { email: credentials.email },
              },
            );

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

            await userModel.update(
              { verify: true },
              {
                  where: { email: credentials.email },
              },
            );

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

            await userModel.update(
              { verify: true },
              {
                  where: { email: credentials.email },
              },
            );

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

    describe('GET /api/auth/avatars', () => {
        let token;

        beforeAll(async () => {
            const credentials = { email: 'subscriptionuser@example.com', password: 'password123' };
            await request(server).post('/api/auth/register').send(credentials);
            const loginRes = await request(server).post('/api/auth/login').send(credentials);
            token = loginRes.body.token;
        });

        it('should update and return user avatarURL', async () => {
            const __dirname = path.resolve();
            const filePath = path.join(__dirname, `/public/${process.env.AVATAR_DIR}/test_avatar.png`);

            const res = await request(server).patch('/api/auth/avatars').set('Authorization', `Bearer ${token}`).attach('avatar', filePath);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Avatar updated successfully');
            expect(res.body).toHaveProperty('avatarURL');
            expect(res.body.avatarURL).toMatch(/^\/avatars\/\d+_[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/);
        });
    });

    describe('POST /api/verify/:verificationToken', () => {
        const specificUserCreds = { email: `someVeryUniqueEmail@gmail.com`, password: 'password123' };

        beforeEach(async () => {
            const result = await request(server).post('/api/auth/register').send(specificUserCreds);
        });

        afterEach(async () => {
            await userModel.destroy({ where: { email: specificUserCreds.email } });
        });

        it('should successfully verify user', async () => {
            const userBefore = await userModel.findOne({ where: { email: specificUserCreds.email } });
            const res = await request(server).get(`/api/auth/verify/${userBefore.verificationToken}`);
            const userAfter = await userModel.findOne({ where: { email: specificUserCreds.email } });

            expect(userBefore.verify).toBeFalsy();
            expect(res.status).toBe(200);
            expect(res.body.message).toEqual('Verification successful');
            expect(userAfter.verify).toBeTruthy();
        });
    });

    describe('POST /api/verify', () => {
        const specificUserCreds = { email: `anotherVeryUniqueEmail@gmail.com`, password: 'password123' };

        beforeEach(async () => {
            await request(server).post('/api/auth/register').send(specificUserCreds);
        });

        afterEach(async () => {
            await userModel.destroy({ where: { email: specificUserCreds.email } });
        });

        it('should successfully resend verification letter to user', async () => {
            const userBefore = await userModel.findOne({ where: { email: specificUserCreds.email } });
            const res = await request(server).post('/api/auth/verify').send({ email: specificUserCreds.email });

            const userAfter = await userModel.findOne({ where: { email: specificUserCreds.email } });
            expect(userBefore.verify).toBeFalsy();
            expect(res.status).toBe(200);
            expect(res.body.message).toEqual('Verification email sent');
            expect(userAfter.verify).toBeFalsy();
        });
    });
});
