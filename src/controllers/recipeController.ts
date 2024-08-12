import { Request, Response } from 'express'
import { validateToken } from '../config/config'
import { Recipe } from '../models/pg/recipeModel'
import { medicineValidation } from '../schemas/medicinesSchema'
import { recipeValidation } from '../schemas/recipeSchema'

export class recipeController {
  static async findMedicines (req: Request, res: Response) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)
      const decodeToken = validateToken(token)

      if (decodeToken === null) throw new Error('invalid token')

      const recipeId = await Recipe.getId(decodeToken.user_id)

      if (recipeId === null) throw new Error("recipe don't created")

      const data = await Recipe.findMedicines(decodeToken.user_id)

      if (data === null) throw new Error('there are no registered medicines yet.')

      if ('error' in data) throw new Error('error to show medicines ')

      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message })
    }
  }

  static async createRecipe (req: Request, res: Response) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)
      const decodeToken = validateToken(token)

      if (decodeToken === null) throw new Error('invalid token')

      const results = recipeValidation(req.body)

      if (results.error) return res.status(400).json({ error: results.error.issues[0].message })

      const data = await Recipe.createRecipe({ user_id: decodeToken.user_id, data: results.data })

      if (data.error) throw new Error('error to add recipe, you may already have one created')

      return res.json({ success: data, data: results.data })
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message })
    }
  }

  static async deleteRecipe (req: Request, res: Response) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)

      const decodeToken = validateToken(token)

      if (decodeToken === null) throw new Error('invalid token')

      const data = await Recipe.deleteRecipe(decodeToken.user_id)

      if (data.error) throw new Error('error to delete recipe')

      return res.json({ success: data })
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message })
    }
  }

  static async createMedicines (req: Request, res: Response) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)
      const decodeToken = validateToken(token)

      if (decodeToken === null) throw new Error('invalid token')

      const results = medicineValidation(req.body)

      if (results.error) return res.status(400).json({ error: results.error.issues[0].message })

      const recipeId = await Recipe.getId(decodeToken.user_id)

      if (recipeId === null) throw new Error("recipe don't created")
      if ('error' in recipeId) throw new Error('error to add medicine')

      const data = await Recipe.createMedicine({ recipe_id: recipeId.id, data: results.data })

      if (data.error) throw new Error('error to add medicine')

      return res.json({ success: data, data: results.data })
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message })
    }
  }

  static async deleteMedicine (req: Request, res: Response) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)
      const decodeToken = validateToken(token)

      if (decodeToken === null) throw new Error('invalid token')

      const { id } = req.query

      if (id === undefined) throw new Error('must provide id')

      const recipeId = await Recipe.getId(decodeToken.user_id)

      if (recipeId === null) throw new Error("recipe don't created")
      if ('error' in recipeId) throw new Error('error to add medicine')
  
      const data = await Recipe.deleteMedicine({ recipe_id: recipeId.id, medicine_id: parseInt(id as string) })

      if (data.error) throw new Error('error to delete medicine')

      return res.json({ success: data })
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message })
    }
  }
}
