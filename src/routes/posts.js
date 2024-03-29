import { Router } from "express";
import { postController } from "../controllers/postController.js";
import { multerMiddleware } from "../middlewares/multer.js";
import path from 'node:path'
import { fileURLToPath  } from 'node:url'



const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const posts = Router()

posts.get('/all', postController.getAllPosts)
posts.get('/get-post', postController.getPost)
posts.get('/user', postController.getUserPosts)
posts.post('/publish', multerMiddleware(__dirname, 'uploads'), postController.createPost)
posts.delete('/delete', postController.deletePost)