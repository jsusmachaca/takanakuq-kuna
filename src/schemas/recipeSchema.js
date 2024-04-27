import { z } from 'zod'


const recipeSchema = z.object({
  start_date: z.string({required_error: 'start date field is required'}).datetime()
})

export const recipeValidation = (data) => {
  return recipeSchema.safeParse(data)
}