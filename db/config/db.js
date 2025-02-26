import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: process.env.DB_LOGGING === 'true',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: true,
        },
    },
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};
