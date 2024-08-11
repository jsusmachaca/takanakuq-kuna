import { dbConnectionPg } from '../../config/config'
import pkg from 'pg'
import { commentData } from '../../types/global'
import { commentQuery } from '../../types/comment'

export class Comment {
  /**
   * Obtiene los comentarios de un post por su ID.
   * @param {number} post_id - El ID del post del cual obtener los comentarios.
   * @returns {Promise<commentQuery[] | {error:string}>} Una promesa que resuelve en un array de objetos representando los comentarios o un objeto de error si ocurre algún problema.
   */
  static async getComments (post_id: number): Promise<commentQuery[] | { error: string }> {
    let connection: pkg.PoolClient | null = null
    try {
      connection = await dbConnectionPg()

      const { rows } = await connection.query<commentQuery, number[]>(`
      SELECT comments.id, users.username, profile.profile_image, comments.comment, comments.date
      FROM comments 
      JOIN users
      ON users.id=comments.user_id
      JOIN profile
      ON comments.user_id=profile.user_id
      WHERE post_id=$1;`,
      [post_id])

      return rows
    } catch (error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: (error as Error).message }
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }

  /**
   * Crea un nuevo comentario en la base de datos.
   * @param {Object} options - Las opciones para crear el comentario.
   * @param {number} options.user_id - El ID del usuario que realiza el comentario.
   * @param {number} options.post_id - El ID del post al cual se asocia el comentario.
   * @param {Object} options.comment - El objeto que contiene el contenido del comentario.
   * @param {string} options.comment.comment - El contenido del comentario.
   * @returns {Promise<{ success: boolean }|{error:string}>} Una promesa que resuelve en verdadero si el comentario se creó exitosamente o un objeto de error si ocurrió algún problema.
   */
  static async createComment (
    { user_id, post_id, comment }: commentData) 
  {
    let connection: pkg.PoolClient | null = null
    try {
      connection = await dbConnectionPg()

      await connection.query<commentQuery, (string | number | undefined)[]>(`
      INSERT INTO comments(user_id, post_id, comment)
      VALUES
      ($1, $2, $3);`,
      [user_id, post_id, comment])
      return { success: true }
    } catch (error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: (error as Error).message }
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }

  /**
   * Elimina un comentario de la base de datos.
   * @param {Object} options - Las opciones para eliminar el comentario.
   * @param {number} options.comment_id - El ID del comentario que se desea eliminar.
   * @param {number} options.user_id - El ID del usuario que creó el comentario.
   * @returns {Promise<{ success: boolean }|{error:string}>} Una promesa que resuelve en verdadero si el comentario se elimina exitosamente o un objeto de error si ocurre algún problema.
   */
  static async deleteComment (
    { comment_id, user_id, post_id }: commentData)
  {
    let connection: pkg.PoolClient | null = null
    try {
      connection = await dbConnectionPg()

      await connection.query<commentQuery, (string | number | undefined)[]>(`
      DELETE FROM comments
      WHERE id=$1 AND user_id=$2 AND post_id=$3;`,
      [comment_id, user_id, post_id])
      return { success: true }
    } catch (error) {
      console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
      return { error: (error as Error).message }
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }
}
