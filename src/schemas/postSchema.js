import { z } from 'zod'

const postSchema = z.object({
  post: z.string().nullable().default(null),
  post_image: z.string().nullable().default(null)
}).refine(data => data.post !== null || data.post_image !== null, {
  message: "at least one of the 'post' or 'image' fields must be present."
})

export const postValidation = (data) => {
  return postSchema.safeParse(data)
}
