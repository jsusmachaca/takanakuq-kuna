// import { dbConnection } from "../../config/config.js";
import { dbConnectionPg } from '../../config/config.js'
import bcrypt from 'bcrypt'



const saltRounds = 10
const connection = await dbConnectionPg()


export class user {
  static async getAll() {
    try {
      const { rows } = await connection.query('SELECT * FROM users')
      return rows
    } 
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return {error: error.message}
    }
  }

  static async findByName({ data }) {
    try{
      const { rows } = await connection.query(`
      SELECT id,username,password 
      FROM users 
      WHERE username=$1;`,
      [data.username])
      
      if(rows.length === 0) return null
      const comparePassword = await bcrypt.compare(data.password, rows[0].password)

      if (!comparePassword) return null
      return rows[0]
    }
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return {error: error.message}
    }
  }

  static async findUser(user_id) {
    try{
      const { rows } = await connection.query(`
      SELECT users.id, users.username, users.first_name, users.last_name, users.email, profile.profile_image, profile.description
      FROM users 
      JOIN profile
      ON users.id=profile.user_id
      WHERE users.id=$1;`,
      [user_id])
      return rows[0]
    }
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return {error: error.message}
    }
  }

  static async createUser({ data }) {
    try {
      const salt = await bcrypt.genSalt(saltRounds)
      const hash = await bcrypt.hash(data.password, salt)

      const { rows } = await connection.query(`
      INSERT INTO users(username, first_name, last_name, email, password)
      VALUES
      ($1, $2, $3, $4, $5);`,
      [data.username, data.first_name, data.last_name, data.email, hash])
      return true
    }
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
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
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
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
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return {error :error.message}
    }
  }

  static async createProfile({ user_id, data }) {
    try {
      const { rows } = await connection.query(`
      INSERT INTO profile(user_id, description, profile_image)
      VALUES
      ($1, $2, $3);`,
      [user_id, data.description, data.profile_image])
      return true
    }
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return {error: error.message}
    }
  }

  static async editProfile({ user_id, data }) {
    try {
      const { rows } = await connection.query(`
      UPDATE profile SET description=$1, profile_image=$2
      WHERE user_id=$3`,
      [data.description, data.profile_image, user_id])
      return true
    }
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return {error: error.message}
    }
  }

}