import { Router } from 'express'
import { postController } from '../controllers/postController'
import { multerMiddleware } from '../middlewares/multer'
import { authMiddleware } from '../middlewares/authentication'

export const posts = Router()

posts.get('/all', authMiddleware, postController.getAllPosts)
posts.get('/get-post', authMiddleware, postController.getPost)
posts.get('/user', authMiddleware, postController.getUserPosts)
posts.post('/publish', authMiddleware, multerMiddleware(), postController.createPost)
posts.delete('/delete', authMiddleware, postController.deletePost)
