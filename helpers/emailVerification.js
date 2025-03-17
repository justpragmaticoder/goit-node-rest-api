import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

// Load environment variables from .env
expand(dotenv.config());

export const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST || 'smtp.ukr.net',
        port: process.env.MAILER_PORT || 465,
        secure: true,
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS,
        },
    });

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

    const mailOptions = {
        from: process.env.MAILER_USER,
        to: email,
        subject: 'Підтвердження email',
        text: `Будь ласка, підтвердіть свій email, перейшовши за посиланням: ${verificationLink}`,
        html: `<p>Будь ласка, підтвердіть свій email, перейшовши за посиланням:</p>
               <a href="${verificationLink}">${verificationLink}</a>`,
    };

  return transporter
    .sendMail(mailOptions)
    .then(info => console.log(info))
    .catch(err => console.log(err));
};
