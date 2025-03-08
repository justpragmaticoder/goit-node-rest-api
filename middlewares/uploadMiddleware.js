import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/${process.env.AVATAR_DIR}`);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.user.id}${ext}`);
    },
});

const upload = multer({ storage });

export default upload;
