import { z } from 'zod'

const recipeSchema = z.object({
  start_date: z.date({ required_error: 'start date field is required' })
})

export const recipeValidation = (data: { start_date: Date }) => {
  return recipeSchema.safeParse(data)
}
