import { Router } from 'express'
import { postController } from '../controllers/postController'
import { multerMiddleware } from '../middlewares/multer'

export const posts = Router()

posts.get('/all', postController.getAllPosts)
posts.get('/get-post', postController.getPost)
posts.get('/user', postController.getUserPosts)
posts.post('/publish', multerMiddleware(), postController.createPost)
posts.delete('/delete', postController.deletePost)
