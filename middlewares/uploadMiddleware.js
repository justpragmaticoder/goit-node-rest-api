import multer from 'multer';
import path from 'path';
import { nanoid } from 'nanoid';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `temp`);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.user.id}_${nanoid()}${ext}`);
    },
});

const upload = multer({ storage });

export default upload;
