import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../db/models/user.js';
import HttpError from '../helpers/HttpError.js';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import { moveTempFile } from '../utils/move-file.util.js';
import { sendVerificationEmail } from '../helpers/emailVerification.js';

const SECRET_KEY = process.env.JWT_SECRET;

export const registerUser = async ({ email, password }) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw HttpError(409, 'Email in use');
    }

    const avatarURL = gravatar.url(email, { s: '200', d: 'retro' }, true);
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    const newUser = await User.create({
        email,
        password: hashedPassword,
        avatarURL,
        verificationToken,
        verify: false,
    });

    await sendVerificationEmail(email, verificationToken);

    return newUser;
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw HttpError(401, 'Email or password is wrong');
    }

    if (!user.verify) {
        throw HttpError(403, 'Email is not verified');
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
    await moveTempFile(`./temp/${file.filename}`, `./public/${process.env.AVATAR_DIR}`);

    const avatarURL = `/${process.env.AVATAR_DIR}/${file.filename}`;

    await User.update({ avatarURL }, { where: { id: userId } });

    return avatarURL;
};

export const verifyUserEmail = async ({ verificationToken }) => {
    if (!verificationToken) {
        throw HttpError(404, 'User not found');
    }

    const user = await User.findOne({ where: { verificationToken } });

    if (!user || user.verify) {
        throw HttpError(404, 'User not found');
    }

    await user.update({ verify: true, verificationToken: null });
};

export const resendVerifyUserEmail = async ({ email }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return {
            status: 404,
            message: 'User not found',
        };
    }

    if (user.verify) {
        return {
            status: 400,
            message: 'Verification has already been passed',
        };
    }

    await sendVerificationEmail(email, user.verificationToken);

    return {
        status: 200,
        message: 'Verification email sent',
    };
};
