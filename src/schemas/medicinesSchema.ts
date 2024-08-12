import { z } from 'zod'
import { MedicineData } from '../types/recipes'

const medicineSchema = z.object({
  medicine_name: z.string({ required_error: 'medicine name field is required' }),
  amount: z.number().min(1),
  hours: z.number().min(1),
  days: z.number().min(1)
})

export const medicineValidation = (data: MedicineData) => {
  return medicineSchema.safeParse(data)
}
