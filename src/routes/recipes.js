import { Router } from "express";
import { recipeController } from "../controllers/recipeController.js";

export const recipes = Router()

recipes.get('/medicines', recipeController.findMedicines)
recipes.post('/create', recipeController.createRecipe)
recipes.post('/medicines/add', recipeController.createMedicines)
recipes.delete('/del', recipeController.deleteRecipe)