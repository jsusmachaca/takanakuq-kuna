import { validateToken } from '../config/config.js'
import { Recipe } from '../models/pg/recipeModel.js'
import { medicineValidation } from '../schemas/medicinesSchema.js'
import { recipeValidation } from '../schemas/recipeSchema.js'

export class recipeController {
  static async findMedicines (req, res) {
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

      if (data.error) throw new Error('error to show medicines ')

      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  static async createRecipe (req, res) {
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

      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  static async deleteRecipe (req, res) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)

      const decodeToken = validateToken(token)

      if (decodeToken === null) throw new Error('invalid token')

      const data = await Recipe.deleteRecipe(decodeToken.user_id)

      if (data.error) throw new Error('error to delete recipe')

      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  static async createMedicines (req, res) {
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

      const data = await Recipe.createMedicine({ recipe_id: recipeId.id, data: results.data })

      if (data.error) throw new Error('error to add medicine')

      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  static async deleteMedicine (req, res) {
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

      const data = await Recipe.deleteMedicine({ recipe_id: recipeId.id, medicine_id: id })

      if (data.error) throw new Error('error to delete medicine')

      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }
}
