import multer from "multer";
import path from 'node:path'


const multerStorage = () => multer.memoryStorage()

export const multerMiddleware = () => multer({
  storage: multerStorage(),
  fileFilter: (req, file, callback) => {
    const fileType = /jpeg|jpg|png|gif|webp|avif/
    const mimetype = fileType.test(file.mimetype)
    const extname = fileType.test(path.extname(file.originalname))
    if (mimetype && extname) {
      callback(null, true)
    } else {
      callback(new Error('the file must be an image'))
    }
  }
}).single('post_image')

export const multerMiddlewareProfile = () => multer({
  storage: multerStorage(),
  fileFilter: (req, file, callback) => {
    const fileType = /jpeg|jpg|png|gif|webp|avif/
    const mimetype = fileType.test(file.mimetype)
    const extname = fileType.test(path.extname(file.originalname))
    if (mimetype && extname) {
      callback(null, true)
    } else {
      callback(new Error('the file must be an image'))
    }
  }
}).single('profile_image')