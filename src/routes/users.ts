import { Router } from 'express'
import { userController } from '../controllers/userController'
import { multerMiddlewareProfile } from '../middlewares/multer'
import { authMiddleware } from '../middlewares/authentication'

export const users = Router()

// users.get('/', userController.getAll)
users.get('/data', authMiddleware, userController.findUser)
users.post('/register', authMiddleware, userController.createUser)
users.post('/login', authMiddleware, userController.findByName)
users.post('/add-profile', authMiddleware, multerMiddlewareProfile(), userController.createProfile)
users.put('/edit-profile', authMiddleware, multerMiddlewareProfile(), userController.editProfile)
// users.put('/edit', userController.editUser)
// users.delete('/delete', userController.deleteUser)
