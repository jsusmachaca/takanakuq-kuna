import { Response } from 'express'
import { AuthRequest as Request } from '../types/global'
import { cryptoNamed, deleteS3Images, getS3Images, uploadS3Images } from '../config/config'
import { Post } from '../models/pg/postModel'
import { postValidation } from '../schemas/postSchema'
import sharp from 'sharp'

export class postController {
  static async getAllPosts (_req: Request, res: Response) {
    try {
      let data = await Post.getAll()

      if ('error' in data) throw new Error('error to show posts')

      data = await Promise.all(data.map(async post => {
        const urlImage = await getS3Images(post.post_image, 'posts')
        const urlProfileImage = await getS3Images(post.profile_image, 'profiles')
        return {
          ...post,
          post_image: post.post_image && urlImage,
          profile_image: post.profile_image && urlProfileImage
        }
      }))
      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message })
    }
  }

  static async getUserPosts (req: Request, res: Response) {
    try {
      const { id } = req.query

      if (id === undefined) throw new Error('must provide id')

      let data = await Post.findByUser(parseInt(id as string))

      if ('error' in data) throw new Error('error to show posts')

      data = await Promise.all(data.map(async post => {
        const urlImage = await getS3Images(post.post_image, 'posts')
        const urlProfileImage = await getS3Images(post.profile_image, 'profiles')
        return {
          ...post,
          post_image: post.post_image && urlImage,
          profile_image: post.profile_image && urlProfileImage
        }
      }))
      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message })
    }
  }

  static async getPost (req: Request, res: Response) {
    try {
      const { id } = req.query

      if (id === undefined) throw new Error('must provide id')

      let data = await Post.findById(parseInt(id as string))

      if (data === null) throw new Error('post not found')

      if ('error' in data) throw new Error('error to get post')

      data = {
        ...data,
        post_image: data.post_image && await getS3Images(data.post_image, 'posts'),
        profile_image: data.profile_image && await getS3Images(data.profile_image, 'profiles')
      }
      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message })
    }
  }

  static async createPost (req: Request, res: Response) {
    try {
      const authUser = req.authUser!
      if (req.file) {
        const filename = cryptoNamed(req.file.originalname)
        const mimetype = req.file.mimetype

        let optimizedBuffer
        switch (mimetype) {
          case 'image/jpeg':
          case 'image/jpg':
            optimizedBuffer = await sharp(req.file.buffer)
              .resize(800)
              .jpeg({ quality: 70, mozjpeg: true })
              .toBuffer()
            break
          case 'image/png':
            optimizedBuffer = await sharp(req.file.buffer)
              .resize(800)
              .png({ compressionLevel: 8 })
              .toBuffer()
            break
          case 'image/webp':
            optimizedBuffer = await sharp(req.file.buffer)
              .resize(800)
              .webp({ quality: 70 })
              .toBuffer()
            break
          case 'image/avif':
            optimizedBuffer = await sharp(req.file.buffer)
              .resize(800)
              .avif({ quality: 50 })
              .toBuffer()
            break
          case 'image/gif':
            optimizedBuffer = await sharp(req.file.buffer)
              .resize(800)
              .gif()
              .toBuffer()
            break
          default:
            return res.status(400).send({ message: 'image format not supported' })
        }

        await uploadS3Images(filename, 'posts', optimizedBuffer)
        req.body.post_image = filename
      }

      const results = postValidation(req.body)

      if (results.error) return res.status(400).json({ error: results.error.issues[0].message })

      const data = await Post.createPost({ user_id: authUser.user_id, post: results.data })

      if (data.error) throw new Error('error to publish post')

      return res.json({ success: data, data: results.data })
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message })
    }
  }

  static async deletePost (req: Request, res: Response) {
    try {
      const authUser = req.authUser!
      const { id } = req.query

      if (id === undefined) throw new Error('must provide id')

      const filename = await Post.getDeletedImage({ id: parseInt(id as string), user_id: authUser.user_id })

      if ('error' in filename!) throw new Error('error to delete post')
      if (filename === null) throw new Error('error to delete post')

      await deleteS3Images(filename!.post_image, 'posts')

      const data = await Post.deletePost({ id: parseInt(id as string), user_id: authUser.user_id })

      if (data.error) throw new Error('error to delete post')

      return res.json({ success: data })
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message })
    }
  }
}
