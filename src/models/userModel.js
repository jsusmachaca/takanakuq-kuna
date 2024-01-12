import { connection } from "../config/config.js";



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
      WHERE username=? AND password=?;`,
      [data.username, data.password])
      if(user.length === 0) return null
      return user[0]
    }
    catch(error) {
      console.error(`\x1b[31mOcurrió un error ${error}\x1b[0m`)
      return {error: error.message}
    }
  }

  static async createUser({ data }) {
    try {
      const [ result, ] = await connection.query(`
      INSERT INTO users(username, first_name, last_name, email, password)
      VALUES
      (?, ?, ?, ?, ?);`,
      [data.username, data.first_name, data.last_name, data.email, data.password])
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