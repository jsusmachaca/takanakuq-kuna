import { cryptoNamed, deleteS3Images, getS3Images, uploadS3Images, validateToken } from '../config/config.js'
import { Post } from '../models/pg/postModel.js'
import { postValidation } from '../schemas/postSchema.js'
import sharp from 'sharp'

export class postController {
  static async getAllPosts (req, res) {
    try {
      let data = await Post.getAll()

      if (data.error) throw new Error('error to show posts')

      data = await Promise.all(data.map(async post => {
        const urlImage = await getS3Images({ filename: post.post_image, carpet: 'posts' })
        const urlProfileImage = await getS3Images({ filename: post.profile_image, carpet: 'profiles' })
        return {
          ...post,
          post_image: post.post_image && urlImage,
          profile_image: post.profile_image && urlProfileImage
        }
      }))
      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  static async getUserPosts (req, res) {
    const authorization = req.headers.authorization
    let token = ''
    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)
      const decodeToken = validateToken(token)

      if (decodeToken === null) throw new Error('invalid token')

      const { id } = req.query

      if (id === undefined) throw new Error('must provide id')

      let data = await Post.findByUser(id)

      if (data.error) throw new Error('error to show posts')

      data = await Promise.all(data.map(async post => {
        const urlImage = await getS3Images({ filename: post.post_image, carpet: 'posts' })
        const urlProfileImage = await getS3Images({ filename: post.profile_image, carpet: 'profiles' })
        return {
          ...post,
          post_image: post.post_image && urlImage,
          profile_image: post.profile_image && urlProfileImage
        }
      }))
      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  static async getPost (req, res) {
    try {
      const { id } = req.query

      if (id === undefined) throw new Error('must provide id')

      let data = await Post.findById(id)

      if (data === null) throw new Error('post not found')

      if (data.error) throw new Error('error to get post')

      data = {
        ...data,
        post_image: data.post_image && await getS3Images({ filename: data.post_image, carpet: 'posts' }),
        profile_image: data.profile_image && await getS3Images({ filename: data.profile_image, carpet: 'profiles' })
      }
      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  static async createPost (req, res) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)
      const decodeToken = validateToken(token)

      if (decodeToken === null) throw new Error('invalid token')

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
            return res.status(400).send({ message: 'image format not supported' });
        }

        await uploadS3Images({ filename, carpet: 'posts', buffer: optimizedBuffer })
        req.body.post_image = filename
      }

      const results = postValidation(req.body)

      if (results.error) return res.status(400).json({ error: results.error.issues[0].message })

      const data = await Post.createPost({ user_id: decodeToken.user_id, post: results.data })

      if (data.error) throw new Error('error to publish post')

      return res.json({ success: data, data: results.data })
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  static async deletePost (req, res) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)

      const decodeToken = validateToken(token)

      if (decodeToken === null) throw new Error('invalid token')

      const { id } = req.query

      if (id === undefined) throw new Error('must provide id')

      const filename = await Post.getDeletedImage({ id, user_id: decodeToken.user_id })
      await deleteS3Images({ filename: filename.post_image, carpet: 'posts' })
      const data = await Post.deletePost({ id, user_id: decodeToken.user_id })

      if (data.error) throw new Error('error to delete post')

      return res.json({ success: data })
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }
}
