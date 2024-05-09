import { Router } from 'express'
import { userController } from '../controllers/userController.js'
import { multerMiddlewareProfile } from '../middlewares/multer.js'


export const users = Router()

// users.get('/', userController.getAll)
users.get('/data', userController.findUser)
users.post('/register', userController.createUser)
users.post('/login', userController.findByName)
users.post('/add-profile', multerMiddlewareProfile() , userController.createProfile)
users.put('/edit-profile', multerMiddlewareProfile(), userController.editProfile)
// users.put('/edit', userController.editUser)
// users.delete('/delete', userController.deleteUser)