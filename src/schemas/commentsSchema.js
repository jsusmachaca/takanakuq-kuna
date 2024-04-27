import { z } from 'zod'


const commentSchema = z.object({
  comment: z.string({required_error: 'comment name field is required'}),
})

export const commentValidation = (data) => {
  return commentSchema.safeParse(data)
}