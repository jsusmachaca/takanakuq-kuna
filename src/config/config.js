import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

dotenv.config()


const config = {
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ?? 3306,
    user: process.env.DB_USER ?? 'jsus',
    password: process.env.DB_PASSWORD ?? 'godylody',
    database: process.env.DB_NAME ?? 'luchadores_test'
}
export const connection = await mysql.createConnection(config)


export const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:9000',
    'http://localhost:8000',
]