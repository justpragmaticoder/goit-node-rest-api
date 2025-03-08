import bcrypt from 'bcryptjs';
import User from '../db/models/user.js';
import HttpError from '../helpers/HttpError.js';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import { moveFile } from '../utils/move-file.util.js';

const SECRET_KEY = process.env.JWT_SECRET;

export const registerUser = async ({ email, password }) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw HttpError(409, 'Email in use');
    }

    const avatarURL = gravatar.url(email, { s: '200', d: 'retro' }, true);
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({ email, password: hashedPassword, avatarURL });
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        console.log('Email or password is wrong');
        throw HttpError(401, 'Email or password is wrong');
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '24h' });
    await user.update({ token });

    return user;
};

export const logoutUser = async ({ userId }) => {
    await User.update({ token: null }, { where: { id: userId } });
};

export const currentUser = async ({ userId }) => {
    return User.findByPk(userId);
};

export const updateUserSubscription = async ({ id, subscription }) => {
    await User.update({ subscription }, { where: { id } });
    return User.findByPk(id);
};

export const updateUserAvatar = async ({ userId, file }) => {
    await moveFile(`./temp/${file.filename}`, `./public/${process.env.AVATAR_DIR}`);

    const avatarURL = `/${process.env.AVATAR_DIR}/${file.filename}`;

    await User.update({ avatarURL }, { where: { id: userId } });

    return avatarURL;
};
