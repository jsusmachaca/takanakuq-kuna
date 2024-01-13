import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'



dotenv.config()

const config = {
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ?? 3306,
    user: process.env.DB_USER ?? 'jsus',
    password: process.env.DB_PASSWORD ?? 'godylody',
    database: process.env.DB_NAME ?? 'luchadores_test'
}

export const dbConnection = async () => {
    try {
        return await mysql.createConnection(config)
    } catch {
        console.error('\x1b[31merror connecting to database\x1b[0m')
    }
}


export const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:9000',
    'http://localhost:8000',
]


export const generateToken = ({ data }) => jwt.sign(data, process.env.SECRET_KEY, {expiresIn: '1y'})

export const validateToken = (token) => {
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        return decodedToken 
    } catch (error) {
        return null
    }
}