export interface MedicineData {
  medicine_id?: number
  medicine_name: string
  amount: number
  hours: number
  days: number
}

export interface RecipeQuery {
  recipe_id: number
  username: string,
  start_date: Date
  medicines: MedicineData[]
}