import { validateToken } from '../config/config.js'
import { Comment } from '../models/pg/commentModel.js'
import { commentValidation } from '../schemas/commentsSchema.js'

export class commentController {
  static async getComments (req, res) {
    try {
      const { post } = req.query

      if (post === undefined) throw new Error('must provide post id')

      const data = await Comment.getComments(post)

      if (data.error) throw new Error('error to show comments')

      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  static async publishComment (req, res) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)
      const decodeToken = validateToken(token)

      if (decodeToken === null) throw new Error('invalid token')

      const { post } = req.query

      if (post === undefined) throw new Error('must provide post id')

      const results = commentValidation(req.body)

      if (results.error) return res.status(400).json({ error: results.error.issues[0].message })

      const data = await Comment.createComment({ user_id: decodeToken.user_id, post_id: post, comment: results.data })

      if (data.error) throw new Error('error to publish comment')

      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  static async deleteComment (req, res) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)
      const decodeToken = validateToken(token)

      if (decodeToken === null) throw new Error('invalid token')

      const { id } = req.query

      if (id === undefined) throw new Error('must provide comment id')

      const data = await Comment.deleteComment({ comment_id: id, user_id: decodeToken.user_id })

      if (data.error) throw new Error('error to delete comment')

      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }
}
