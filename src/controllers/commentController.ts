import { Request, Response } from 'express'
import { validateToken, getS3Images } from '../config/config'
import { Comment } from '../models/pg/commentModel'
import { commentValidation } from '../schemas/commentsSchema'

export class commentController {
  static async getComments (req: Request, res: Response) {
    try {
      const { post } = req.query

      if (post === undefined) throw new Error('must provide post id')

      let data = await Comment.getComments(parseInt(post as string))

      if ('error' in data) throw new Error('error to show comments')

      data = await Promise.all(data.map(async commet => {
        const urlProfileImage = await getS3Images(commet.profile_image, 'profiles')
        return {
          ...commet,
          profile_image: commet.profile_image && urlProfileImage
        }
      }))
      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message })
    }
  }

  static async publishComment (req: Request, res: Response) {
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

      const data = await Comment.createComment({ user_id: decodeToken.user_id, post_id: parseInt(post as string), comment: results.data.comment })

      if (data.error) throw new Error('error to publish comment')

      return res.json({ success: data, data: results.data })
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message })
    }
  }

  static async deleteComment (req: Request, res: Response) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)
      const decodeToken = validateToken(token)

      if (decodeToken === null) throw new Error('invalid token')

      const { id, post } = req.query

      if (id === undefined || post === undefined) throw new Error('must provide comment id or post')

      const data = await Comment.deleteComment({ comment_id: parseInt(id as string), user_id: decodeToken.user_id, post_id: parseInt(post as string) })

      if (data.error) throw new Error('error to delete comment')

      return res.json({ success: data })
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message })
    }
  }
}
