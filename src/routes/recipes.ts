import { Router } from 'express'
import { recipeController } from '../controllers/recipeController'
import { authMiddleware } from '../middlewares/authentication'

export const recipes = Router()

recipes.get('/medicines', authMiddleware, recipeController.findMedicines)
recipes.post('/create', authMiddleware, recipeController.createRecipe)
recipes.post('/medicines/add', authMiddleware, recipeController.createMedicines)
recipes.delete('/delete', authMiddleware, recipeController.deleteRecipe)
recipes.delete('/medicines/delete', authMiddleware, recipeController.deleteMedicine)
