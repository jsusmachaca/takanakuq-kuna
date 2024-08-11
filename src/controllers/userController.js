import { User } from '../models/pg/userModel.js'
import { userProfileValidation, userValidation, userValidationPartial } from '../schemas/userSchema.js'
import { cryptoNamed, generateToken, uploadS3Images, validateToken, getS3Images } from '../config/config'
import sharp from 'sharp'

export class userController {
  static async getAll (req, res) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)
      const validation = validateToken(token)

      if (validation === null) throw new Error('invalid token')

      const data = await User.getAll()
      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  // Login Controller
  static async findByName (req, res) {
    const results = userValidationPartial(req.body)

    if (results.error) return res.status(400)

    const data = await User.findByName({ data: results.data })

    if (data === null) return res.status(404).json({ error: 'incorrect credentials' })

    if (data.error) return res.status(404).json({ error: 'incorrect credentials' })

    const userForToken = {
      user_id: data.id,
      username: data.username,
      is_admin: data.is_admin,
      is_staff: data.is_staff
    }
    const token = generateToken(userForToken)
    return res.json({ access_token: token })
  }

  // Show user profile data
  static async findUser (req, res) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)
      const validation = validateToken(token)

      if (validation === null) throw new Error('invalid token')

      let data = await User.findUser(validation.user_id)

      if (data === null) throw new Error('user not found')

      if (data.error) return res.status(400).json({ error: 'error when showing user' })

      data = {
        ...data,
        profile_image: data.profile_image && await getS3Images(data.profile_image, 'profiles')
      }
      return res.json(data)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  // Register controller
  static async createUser (req, res) {
    const results = userValidation(req.body)

    if (results.error) return res.status(400).json({ error: results.error.issues[0].message })

    const data = await User.createUser({ data: results.data })

    if (data.error) {
      if (data.error.startsWith('llave duplicada') || data.error.startsWith('duplicate key')) {
        return res.status(400).json({ error: 'the user you are trying to register already exists' })
      }
      return res.status(400).json({ error: 'register error' })
    }

    return res.status(201).json({ success: data, data: results.data })
  }

  static async editUser (req, res) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)
      const validation = validateToken(token)

      if (validation === null) throw new Error('invalid token')

      const results = userValidationPartial(req.body)

      if (results.error) return res.status(400).json({ error: results.error.issues[0].message })

      const { id } = req.query

      if (id === undefined) throw new Error('must provide id')

      const data = await User.editUser({ id, data: results.data })

      if (data.error) return res.status(400).json({ error: 'error when modifying' })

      return res.json({ success: data, data: results.data })
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  static async deleteUser (req, res) {
    const authorization = req.headers.authorization
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token += authorization.substring(7)
      const validation = validateToken(token)

      if (validation === null) throw new Error('invalid Token')

      const { id } = req.query

      if (id === undefined) throw new Error('must provide id')

      const data = await User.deleteUser(id)
      return res.json({ success: data })
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  // Add profile data for users
  static async createProfile (req, res) {
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
            return res.status(400).send({ message: 'image format not supported' })
        }

        await uploadS3Images(filename, 'profiles', optimizedBuffer)
        req.body.profile_image = filename
      }

      const results = userProfileValidation(req.body)

      if (results.error) return res.status(400).json({ error: results.error.issues[0].message })

      const data = await User.createProfile({ user_id: decodeToken.user_id, data: results.data })

      if (data.error) return res.status(400).json({ error: 'save error' })

      return res.status(201).json({ success: data, data: results.data })
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  // Edit profile data to users
  static async editProfile (req, res) {
    const authorization = req.headers.authorization // extract token of header
    let token = ''

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided') // validate token

      token += authorization.substring(7)
      const decodeToken = validateToken(token)

      if (decodeToken === null) throw new Error('invalid token')

      if (req.file) { // extract file
        const filename = cryptoNamed(req.file.originalname)
        await uploadS3Images(filename, 'profiles', req.file.buffer)
        req.body.profile_image = filename
      }

      const results = userProfileValidation(req.body)

      if (results.error) return res.status(400).json({ error: results.error.issues[0].message })

      const data = await User.editProfile({ user_id: decodeToken.user_id, data: results.data })

      if (data.error) return res.status(400).json({ error: 'error when modifying' })

      return res.json({ success: data, data: results.data })
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }
}
