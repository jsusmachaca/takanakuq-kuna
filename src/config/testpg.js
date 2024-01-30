import 'dotenv/config'
import pkg from 'pg'

const { Pool } = pkg

const config = {
    host: process.env.DB_HOST ?? 'localhost',
    //port: process.env.DB_PORT ?? 3306,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'godylody',
    database: process.env.DB_NAME ?? 'test'
}


const pool = new Pool(config)

const dbConnectionPg = async () => {
    try {
        return await pool.connect()
    } catch (error) {
        console.error('\x1b[31merror connecting to database\x1b[0m' + error)
    }
}


const con = await dbConnectionPg()

const { rows } = await con.query('SELECT * FROM users;')
console.log(rows)
con.release()