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

try {

    const result = await con.query(`
    INSERT INTO users(username, first_name, last_name, email, password)
    VALUES
    ($1, $2, $3, $4, $5);`,
    ['lindo', 'pepe', 'juanito', 'puto', 'aadsadasasdas42'])
    console.log(result)
} catch (error) {
    console.log('hay un erro bro' + error)
}