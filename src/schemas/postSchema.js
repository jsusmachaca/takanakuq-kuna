import { z } from "zod";

const postSchema = z.object({
    post: z.string({required_error: 'post field is required'}),
    image: z.string().url().nullable().default(null)
})


export const postValidation = (data) => {
    return postSchema.safeParse(data)
}

export const postValidationPartial = (data) => {
    return postSchema.partial().safeParse(data)
}