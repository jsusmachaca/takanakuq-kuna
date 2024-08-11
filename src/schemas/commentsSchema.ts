import { z } from 'zod'
import { commentRequest } from '../types/comment'

const commentSchema = z.object({
  comment: z.string({ required_error: 'comment name field is required' })
})

export const commentValidation = (data: commentRequest) => {
  return commentSchema.safeParse(data)
}
