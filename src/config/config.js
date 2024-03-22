import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'
import pkg from 'pg'

const { Pool } = pkg


dotenv.config()

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


export const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:9000',
    'http://localhost:8000',
    'http://localhost',
    'http://127.0.0.1:5501',
    'http://localhost:19006',
    'http://127.0.0.1:19006'
]

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