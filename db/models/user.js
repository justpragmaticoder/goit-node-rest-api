import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const User = sequelize.define('user', {
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    subscription: {
        type: DataTypes.ENUM('starter', 'pro', 'business'),
        defaultValue: 'starter',
    },
    token: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
});

export default User;
