// import { dbConnection } from '../../config/config.js'
import { dbConnectionPg } from '../../config/config.js'
import bcrypt from 'bcrypt'


const saltRounds = 10

export class User {
  /**
   * Obtiene todos los usuarios de la base de datos.
   * @returns {Promise<Object[]|{error:string}>} Una promesa que resuelve en una lista de objetos que representan a los usuarios, o un objeto de error si ocurre algún problema.
   */
  static async getAll() {
    try {
      const connection = await dbConnectionPg()

      const { rows } = await connection.query('SELECT * FROM users')
      return rows
    } 
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    }
  }

  /**
   * Encuentra un usuario por su nombre de usuario en la base de datos y verifica su contraseña.
   * @param {Object} options - Las opciones para encontrar al usuario.
   * @param {Object} options.data - Los datos del usuario para buscar.
   * @param {string} options.data.username - El nombre de usuario del usuario que se desea encontrar.
   * @param {string} options.data.password - La contraseña del usuario que se desea verificar.
   * @returns {Promise<Object|null|{error:string}>} Una promesa que resuelve en un objeto que representa al usuario encontrado, o nulo si no se encuentra ningún usuario con el nombre de usuario dado, o un objeto de error si ocurre algún problema.
   */
  static async findByName({ data }) {
    try{
      const connection = await dbConnectionPg()

      const { rows } = await connection.query(`
      SELECT id, username, password 
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
      return { error: error.message }
    }
  }

  /**
   * Encuentra un usuario por su ID en la base de datos, junto con su perfil asociado.
   * @param {number} user_id - El ID del usuario que se desea encontrar.
   * @returns {Promise<Object|null|{error:string}>} Una promesa que resuelve en un objeto que representa al usuario encontrado con su perfil asociado, o nulo si no se encuentra ningún usuario con el ID dado, o un objeto de error si ocurre algún problema.
   */
  static async findUser(user_id) {
    try{
      const connection = await dbConnectionPg()

      const { rows } = await connection.query(`
      SELECT users.id, users.username, users.first_name, users.last_name, users.email, profile.profile_image, profile.description
      FROM users 
      JOIN profile
      ON users.id=profile.user_id
      WHERE users.id=$1;`,
      [user_id])

      if(rows.length === 0) return null

      return rows[0]
    }
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    }
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   * @param {Object} options - Las opciones para crear el usuario.
   * @param {Object} options.data - Los datos del usuario para crear.
   * @param {string} options.data.username - El nombre de usuario del nuevo usuario.
   * @param {string} options.data.first_name - El primer nombre del nuevo usuario.
   * @param {string} options.data.last_name - El apellido del nuevo usuario.
   * @param {string} options.data.email - El correo electrónico del nuevo usuario.
   * @param {string} options.data.password - La contraseña del nuevo usuario.
   * @returns {Promise<boolean|{error:string}>} Una promesa que resuelve en verdadero si el usuario se crea exitosamente, o un objeto de error si ocurre algún problema.
   */
  static async createUser({ data }) {
    try {
      const connection = await dbConnectionPg()

      const salt = await bcrypt.genSalt(saltRounds)
      const hash = await bcrypt.hash(data.password, salt)
      await connection.query(`
      INSERT INTO users(username, first_name, last_name, email, password)
      VALUES
      ($1, $2, $3, $4, $5);`,
      [data.username, data.first_name, data.last_name, data.email, hash])
      return true
    }
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    }
  }

  /**
   * Elimina un usuario de la base de datos según su ID.
   * @param {number} id - El ID del usuario que se desea eliminar.
   * @returns {Promise<boolean|{error:string}>} Una promesa que resuelve en verdadero si el usuario se elimina exitosamente, o un objeto de error si ocurre algún problema.
   */
  static async deleteUser(id) {
    try {
      const connection = await dbConnectionPg()

      await connection.query(`
      DELETE FROM users
      WHERE id=$1`,
      [id])
      return true
    } 
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    }
  }

  /**
   * Edita un usuario en la base de datos según su ID.
   * @param {Object} options - Las opciones para editar el usuario.
   * @param {number} options.id - El ID del usuario que se desea editar.
   * @param {Object} options.data - Los nuevos datos del usuario.
   * @param {string} options.data.first_name - El nuevo primer nombre del usuario.
   * @param {string} options.data.last_name - El nuevo apellido del usuario.
   * @returns {Promise<boolean|{error:string}>} Una promesa que resuelve en verdadero si el usuario se edita exitosamente, o un objeto de error si ocurre algún problema.
   */
  static async editUser({ id, data }) {
    try {
      const connection = await dbConnectionPg()

      await connection.query(`
      UPDATE users SET first_name=$1, last_name=$2 
      WHERE id=$3`,
      [data.first_name, data.last_name, id]) 
      return true
    }
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error :error.message }
    }
  }

  /**
   * Crea un nuevo perfil para un usuario en la base de datos.
   * @param {number} user_id - El ID del usuario para el cual se creará el perfil.
   * @param {Object} data - Los datos del perfil a crear.
   * @param {string} data.description - La descripción del perfil.
   * @param {string} data.profile_image - La URL de la imagen del perfil.
   * @returns {Promise<boolean|{error:string}>} Una promesa que resuelve en verdadero si el perfil se crea exitosamente, o un objeto de error si ocurre algún problema.
   */
  static async createProfile({ user_id, data }) {
    try {
      const connection = await dbConnectionPg()

      await connection.query(`
      INSERT INTO profile(user_id, description, profile_image)
      VALUES
      ($1, $2, $3);`,
      [user_id, data.description, data.profile_image])
      return true
    }
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    }
  }

  /**
   * Edita el perfil de un usuario en la base de datos.
   * @param {number} user_id - El ID del usuario cuyo perfil se desea editar.
   * @param {Object} data - Los nuevos datos del perfil.
   * @param {string} data.description - La nueva descripción del perfil.
   * @param {string} data.profile_image - La nueva URL de la imagen del perfil.
   * @returns {Promise<boolean|{error:string}>} Una promesa que resuelve en verdadero si el perfil se edita exitosamente, o un objeto de error si ocurre algún problema.
   */
  static async editProfile({ user_id, data }) {
    try {
      const connection = await dbConnectionPg()

      await connection.query(`
      UPDATE profile SET description=$1, profile_image=$2
      WHERE user_id=$3`,
      [data.description, data.profile_image, user_id])
      return true
    }
    catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    }
  }
}