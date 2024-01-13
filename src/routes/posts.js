import { Router } from "express";
import { postController } from "../controllers/postController.js";

export const posts = Router()

posts.get('/', postController.getAllPosts)
posts.get('/post', postController.getPost)
posts.get('/user', postController.getUserPosts)
posts.post('/publish', postController.createPost)