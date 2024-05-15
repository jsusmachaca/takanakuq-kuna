import { commentController } from '../controllers/commentController.js'
import { Router } from 'express'

export const comments = Router()

comments.get('/get-comments', commentController.getComments)
comments.post('/publish-comment', commentController.publishComment)
comments.delete('/delete-comment', commentController.deleteComment)
