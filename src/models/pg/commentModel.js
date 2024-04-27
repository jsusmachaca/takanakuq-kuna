import { dbConnectionPg } from '../../config/config.js'


const connection = await dbConnectionPg()

export class comment {
  /**
   * Obtiene los comentarios de un post por su ID.
   * @param {number} post_id - El ID del post del cual obtener los comentarios.
   * @returns {Promise<Array<Object>|{error:string}>} Una promesa que resuelve en un array de objetos representando los comentarios o un objeto de error si ocurre algún problema.
   */
  static async getComments(post_id) {
    try {
      const { rows } = await connection.query(`
      SELECT comments.id, users.username, profile.profile_image, comments.comment, comments.date
      FROM comments 
      JOIN users
      ON users.id=comments.user_id
      JOIN profile
      ON comments.user_id=profile.user_id
      WHERE post_id=$1;`,
      [post_id])
      return rows
    } catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    }
  }

  /**
   * Crea un nuevo comentario en la base de datos.
   * @param {Object} options - Las opciones para crear el comentario.
   * @param {number} options.user_id - El ID del usuario que realiza el comentario.
   * @param {number} options.post_id - El ID del post al cual se asocia el comentario.
   * @param {Object} options.comment - El objeto que contiene el contenido del comentario.
   * @param {string} options.comment.comment - El contenido del comentario.
   * @returns {Promise<boolean|{error:string}>} Una promesa que resuelve en verdadero si el comentario se creó exitosamente o un objeto de error si ocurrió algún problema.
   */
  static async createComment({ user_id, post_id, comment }) {
    try {
      const { rows } = await connection.query(`
      INSERT INTO comments(user_id, post_id, comment)
      VALUES
      ($1, $2, $3);`,
      [user_id, post_id, comment.comment])
      return true
    } catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    }
  }
  
  /**
   * Elimina un comentario de la base de datos.
   * @param {Object} options - Las opciones para eliminar el comentario.
   * @param {number} options.comment_id - El ID del comentario que se desea eliminar.
   * @param {number} options.user_id - El ID del usuario que creó el comentario.
   * @returns {Promise<boolean|{error:string}>} Una promesa que resuelve en verdadero si el comentario se elimina exitosamente o un objeto de error si ocurre algún problema.
   */
  static async deleteComment({ comment_id, user_id }) {
    try {
      const { rows } = await connection.query(`
      DELETE FROM comments
      WHERE id=$1 AND user_id=$2;`,
      [comment_id, user_id])
      return true
    } catch(error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: error.message }
    }
  }
}