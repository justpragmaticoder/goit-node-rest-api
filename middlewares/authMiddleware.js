import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
import HttpError from '../helpers/HttpError.js';

const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next(HttpError(401, 'Not authorized'));
        }

        const token = authHeader.split(' ')[1];

        let decoded;
        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (error) {
            next(HttpError(401, 'Not authorized'));
        }

        const user = await User.findByPk(decoded.id);
        if (!user || user.token !== token) {
            next(HttpError(401, 'Not authorized'));
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;
