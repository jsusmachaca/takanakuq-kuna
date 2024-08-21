import { commentController } from '../controllers/commentController'
import { authMiddleware } from '../middlewares/authentication'
import { Router } from 'express'

export const comments = Router()

comments.get('/get-comments', authMiddleware, commentController.getComments)
comments.post('/publish-comment', authMiddleware, commentController.publishComment)
comments.delete('/delete-comment', authMiddleware, commentController.deleteComment)
