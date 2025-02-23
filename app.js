import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import contactsRouter from './routes/contactsRouter.js';
import { connectDB, sequelize } from './db/config/db.js'; // Import database connection

export const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use((_, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;

let server;

const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync();
        server = app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

startServer();

export { server };