import { Router } from 'express'
import { postController } from '../controllers/postController.js'
import { multerMiddleware } from '../middlewares/multer.js'

export const posts = Router()

posts.get('/all', postController.getAllPosts)
posts.get('/get-post', postController.getPost)
posts.get('/user', postController.getUserPosts)
posts.post('/publish', multerMiddleware(), postController.createPost)
posts.delete('/delete', postController.deletePost)
