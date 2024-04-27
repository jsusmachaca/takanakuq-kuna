import { dbConnectionPg } from '../../config/config.js'


const connection = await dbConnectionPg()

export class comment {
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