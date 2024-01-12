import { connection } from "../config/config.js";
import bcrypt, { hash } from 'bcrypt'

const saltRounds = 10


export class user {
  static async getAll() {
    try {
      const [users, ] = await connection.query('SELECT * FROM users')
      return users
    } 
    catch(error) {
      console.error(`\x1b[31mOcurrió un error ${error}\x1b[0m`)
      return {error: error.message}
    }
  }

  static async findByName({ data }) {
    try{
      const [user, ] = await connection.query(`
      SELECT id,username,password 
      FROM users 
      WHERE username=?;`,
      [data.username])
      
      if(user.length === 0) return null
      const comparePassword = await bcrypt.compare(data.password, user[0].password)
      if (!comparePassword) return null
      return user[0]
    }
    catch(error) {
      console.error(`\x1b[31mOcurrió un error ${error}\x1b[0m`)
      return {error: error.message}
    }
  }

  static async createUser({ data }) {
    try {
      const salt = await bcrypt.genSalt(saltRounds)
      const hash = await bcrypt.hash(data.password, salt)

      const [ result, ] = await connection.query(`
      INSERT INTO users(username, first_name, last_name, email, password)
      VALUES
      (?, ?, ?, ?, ?);`,
      [data.username, data.first_name, data.last_name, data.email, hash])
      return true
    }
    catch(error) {
      console.error(`\x1b[31mOcurrió un error ${error}\x1b[0m`)
      return {error: error.message}
    }
  }

  static async deleteUser(id) {
    try {
      const [ result, ] = await connection.query(`
      DELETE FROM users WHERE id=?`, [id])
      return true
    } 
    catch(error) {
      console.error(`\x1b[31mOcurrió un error ${error}\x1b[0m`)
      return {error: error.message}
    }
  }

  static async editUser({ id, data }) {
    try {
      const [ result, ] = await   connection.query(`
      UPDATE users SET first_name=?, last_name=? WHERE id=?`, [data.first_name, data.last_name, id]) 
      return true
    }
    catch(error) {
      console.error(`\x1b[31mOcurrió un error ${error}\x1b[0m`)
      return {error :error.message}
    }
  }
}