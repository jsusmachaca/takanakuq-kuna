import { z } from "zod";

const medicineSchema = z.object({
    medicine_name: z.string({required_error: 'medicine name field is required'}),
    amount: z.number().min(1),
    hours: z.number().min(1)
})

export const medicineValidation = (data) => {
    return medicineSchema.safeParse(data)
}