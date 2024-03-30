import multer from "multer";
import path from 'node:path'
import { randomUUID } from "node:crypto";


const multerStorage = dest => multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, randomUUID() + path.extname(file.originalname).toLowerCase())
  },
  destination: dest
})

export const multerMiddleware = (dirname, destination) => multer({
  storage: multerStorage(path.join(dirname, '..', 'public', destination)),
  // dest: path.join(dirname, '..', 'public', 'uploads'),
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
}).single('post_image')

export const multerMiddlewareProfile = (dirname, destination) => multer({
  storage: multerStorage(path.join(dirname, '..', 'public', destination)),
  // dest: path.join(dirname, '..', 'public', 'uploads'),
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
}).single('profile_image')