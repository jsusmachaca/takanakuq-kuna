import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'
import pkg from 'pg'

const { Pool } = pkg


dotenv.config()

const config = {
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ?? 5432,
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'luchadores_test'
}

const pool = new Pool(config)

export const dbConnectionPg = async () => {
    try {
        return await pool.connect()
    } catch (error) {
        console.error('\x1b[31merror connecting to database\x1b[0m' + error)
    }
}

export const dbConnectionMysql = async () => {
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
    'http://localhost',
    'http://127.0.0.1:5501',
    'http://localhost:19006',
    'http://127.0.0.1:19006'
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


export const dateNow = () => {
    const fechaHoraUtc = new Date();

    const zonaHorariaLima = 'America/Lima';

    const formatoFechaHora = new Intl.DateTimeFormat('es-PE', {
    timeZone: zonaHorariaLima,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    });

    return fechaHoraUtc.toISOString().slice(0, 19).replace("T", " ");
}