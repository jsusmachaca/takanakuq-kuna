import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { multerMiddlewareProfile } from "../middlewares/multer.js";
import path from 'node:path'
import { fileURLToPath  } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const users = Router()


// users.get('/', userController.getAll)
users.get('/', userController.findUser)
users.post('/register', userController.createUser)
users.post('/login', userController.findByName)
users.post('/add-profile', multerMiddlewareProfile(__dirname, 'profiles') , userController.createProfile)
users.put('/edit-profile', multerMiddlewareProfile(__dirname, 'profiles'), userController.editProfile)
// users.put('/edit', userController.editUser)
// users.delete('/delete', userController.deleteUser)