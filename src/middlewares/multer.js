import multer from "multer";
import path from 'node:path'
import { multerStorage } from "../config/config.js";


export const multerMiddleware = dirname => multer({
    storage: multerStorage(path.join(dirname, '..', 'public', 'uploads')),
    dest: path.join(dirname, 'public', 'uploads'),
    fileFilter: (req, file, callback) => {
        const fileType = /jpeg|jpg|png|gif|webp/
        const mimetype = fileType.test(file.mimetype)
        const extname = fileType.test(path.extname(file.originalname))
        if (mimetype && extname) {
            callback(null, true)
        } else {
            callback(new Error('the file must be an image'))
        }
    }
}).single('image')