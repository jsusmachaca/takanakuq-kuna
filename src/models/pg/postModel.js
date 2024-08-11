import { dbConnectionPg } from '../../config/config'

export class Post {
  /**
   * Encuentra todos los posts de la base de datos.
   * @returns {Promise<Object[]|{error:string}>} All posts made by users.
   */
  static async getAll () {
    let connection
    try {
      connection = await dbConnectionPg()

      const { rows } = await connection.query(`
      SELECT posts.id, users.id as user_id, users.username, profile.profile_image, posts.post, posts.post_image, posts.date_publish
      FROM posts 
      JOIN users 
      ON posts.user_id=users.id
      JOIN profile
      ON posts.user_id=profile.user_id
      
      ORDER BY posts.id DESC;
      `)
      return rows
    } catch (error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    } finally {
      connection.release()
    }
  }

  /**
   * Encuentra todos los posts asociados a un usuario por su ID en la base de datos.
   * @param {number} id - El ID del usuario cuyos posts se desean encontrar.
   * @returns {Promise<Object[]|{error:string}>} Una promesa que resuelve en una lista de objetos que representan los posts encontrados, o un objeto de error si ocurre algún problema.
   */
  static async findByUser (id) {
    let connection
    try {
      connection = await dbConnectionPg()

      const { rows } = await connection.query(`
      SELECT posts.id, users.id as user_id, profile.profile_image, posts.post, posts.post_image, posts.date_publish
      FROM posts
      JOIN profile
      ON posts.user_id=profile.user_id
      JOIN users
      ON posts.user_id=users.id
      WHERE posts.user_id=$1

      ORDER BY posts.id DESC;`,
      [id])
      return rows
    } catch (error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    } finally {
      connection.release()
    }
  }

  /**
   * Encuentra un post por su ID en la base de datos.
   * @param {number} id - El ID del post que se desea encontrar.
   * @returns {Promise<post|{error:string}>} Una promesa que resuelve en un objeto que representa el post encontrado, o nulo si no se encuentra ningún post con el ID dado.
   */
  static async findById (id) {
    let connection
    try {
      connection = await dbConnectionPg()

      const { rows } = await connection.query(`
      SELECT users.username, profile.profile_image, posts.post, posts.post_image, posts.date_publish
      FROM posts
      JOIN users
      ON posts.user_id=users.id
      JOIN profile
      ON posts.user_id=profile.user_id
      WHERE posts.id=$1;`,
      [id])

      if (rows.length === 0) return null

      return rows[0]
    } catch (error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    } finally {
      connection.release()
    }
  }

  /**
   * Crea un nuevo post en la base de datos.
   * @param {Object} options - Las opciones para crear el post.
   * @param {number} options.user_id - El ID del usuario que crea el post.
   * @param {Object} options.post - El objeto que contiene los detalles del post.
   * @param {string} options.post.post - El contenido del post.
   * @param {string} options.post.post_image - La imagen asociada al post (opcional).
   * @returns {Promise<boolean>} Una promesa que resuelve en verdadero si el post se creó exitosamente, o un objeto de error si ocurrió algún problema.
   */
  static async createPost ({ user_id, post }) {
    let connection
    try {
      connection = await dbConnectionPg()

      await connection.query(`
      INSERT INTO posts(user_id, post, post_image)
      VALUES
      ($1, $2, $3);`,
      [user_id, post.post, post.post_image])
      return true
    } catch (error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    } finally {
      connection.release()
    }
  }

  /**
   * Elimina un post de la base de datos.
   * @param {Object} options - Las opciones para eliminar el post.
   * @param {number} options.id - El ID del post que se desea eliminar.
   * @param {number} options.user_id - El ID del usuario que creó el post.
   * @returns {Promise<boolean|{error:string}>} Una promesa que resuelve en verdadero si el post se elimina exitosamente, o un objeto de error si ocurre algún problema.
   */
  static async deletePost ({ id, user_id }) {
    let connection
    try {
      connection = await dbConnectionPg()

      await connection.query(`
      DELETE FROM posts
      WHERE id=$1 AND user_id=$2;`,
      [id, user_id])
      return true
    } catch (error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    } finally {
      connection.release()
    }
  }

  /**
   * Elimina la imagen del post del "bucket" de S3.
   * @param {Object} options - Las opciones para eliminar el post.
   * @param {number} options.id - El ID del post que se desea eliminar.
   * @param {number} options.user_id - El ID del usuario que creó el post.
   * @returns {Promise<number|{error:string}>} Una promesa que resuelve en verdadero si el post se elimina exitosamente, o un objeto de error si ocurre algún problema.
   */
  static async getDeletedImage ({ id, user_id }) {
    let connection
    try {
      connection = await dbConnectionPg()

      const { rows } = await connection.query(`
      SELECT post_image FROM posts
      WHERE id=$1 AND user_id=$2;`,
      [id, user_id])

      if (rows.length === 0) return null

      return rows[0]
    } catch (error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    } finally {
      connection.release()
    }
  }
}
