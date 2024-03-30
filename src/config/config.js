import 'dotenv/config'
import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'
import pkg from 'pg'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'


// CORS ORIGINS
export const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:9000',
  'http://localhost:8000',
  'http://localhost',
  'http://127.0.0.1:5501',
  'http://localhost:19006',
  'http://127.0.0.1:19006'
]

// DATABASES CONFIG
const { Pool } = pkg

let config
config = {
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ?? 5432,
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'luchadores_test',
}

const pool = new Pool(config)


export const dbConnectionPg = async () => {
  let retries = 5
  while (retries > 0) {
    try {
      return await pool.connect()
    } catch (error) {
      retries--
      console.error(`\x1b[33mTrying to establish a connection to the database\x1b[0m => ${error}`)
      await new Promise(resolve => setTimeout(resolve, 6000))
    }
  }
  console.error('\x1b[31m\nCould not establish connection after attempts\n\x1b[0m')
}


export const dbConnectionMysql = async () => {
  try {
    return await mysql.createConnection(config)
  } catch (error) {
    console.error(`\x1b[31mError connecting to mysql database \x1b[0m => ${error}`)
  }
}

// JWT CONFIG
const SECRET_KEY = process.env.SECRET_KEY

export const generateToken = ({ data }) => jwt.sign(data, SECRET_KEY, {expiresIn: '1y'})

export const validateToken = (token) => {
  try{
    const decodedToken = jwt.verify(token, SECRET_KEY)
    return decodedToken 
  } catch (error) {
    return null
  }
}


// AWS CONFIG
export const cryptoNamed = (originalName) => {
  const newName = randomUUID().replace(/-/g, '') + extname(originalName).toLowerCase()
  return newName
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

export const uploadS3Images = async ({ filename, carpet, buffer }) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${carpet}/${filename}`,
    Body: buffer
  }
  const command = new PutObjectCommand(params)
  const result = await s3.send(command)
  return result
}

export const getS3Images = async ({ filename, carpet }) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${carpet}/${filename}`,
  }
  const command = new GetObjectCommand(params)
  const urlImage = await getSignedUrl(s3, command)
  return urlImage
}

export const deleteS3Images = async ({ filename, carpet }) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${carpet}/${filename}`,
  }
  const command = new DeleteObjectCommand(params)
  const result = await s3.send(command)
  return result
}