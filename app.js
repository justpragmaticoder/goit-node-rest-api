import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

import contactsRouter from './routes/contactsRouter.js';
import authRouter from './routes/authRouter.js';
import { connectDB } from './db/config/db.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

const __dirname = path.resolve();
export const app = express();

// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contacts', contactsRouter);
app.use('/api/auth', authRouter);

app.use(express.static(path.join(__dirname, 'public')));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.APP_PORT || 3000;
let server;

export const startServer = async (port) => {
    try {
        await connectDB();
        server = await new Promise((resolve, reject) => {
            const appPort = port || PORT;
            const srv = app.listen(appPort, () => {
                console.log(`Server is running on port: ${appPort}`);
                resolve(srv);
            });
            srv.on('error', reject);
        });

        // Optional: handle graceful shutdown
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

        return server;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

const shutdown = async () => {
    if (server) {
        server.close(() => {
            console.log('Server closed gracefully');
            process.exit(0);
        });
    }
};

// If this file is run directly (and not imported), start the server.
if (process.env.NODE_ENV !== 'test') {
    startServer();
}

export { server };
