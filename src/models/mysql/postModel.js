import { dbConnection } from "../../config/config.js";

const connection = await dbConnection()


export class post {
    static async getAll() {
        try {
            const [posts, ] = await connection.query(`
            SELECT posts.id, users.username, posts.post, posts.post_image, posts.date_publish
            FROM posts 
            JOIN users 
            ON posts.user_id=users.id
            ORDER BY posts.id;
            `)
            return posts
        } catch(error) {
            console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
            return {error: error.message}
        }
    }

    static async findByUser(id) {
        try {
            const [post, ] = await connection.query(`
            SELECT post, post_image, date_publish
            FROM posts
            WHERE user_id=?;
            `,
            [id])
            return post
        } catch(error) {
            console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
            return {error: error.message}
        }
    }

    static async findById(id) {
        try {
            const [post, ] = await connection.query(`
            SELECT users.username, posts.post, posts.post_image, posts.date_publish
            FROM posts
            JOIN users
            ON posts.user_id=users.id
            WHERE posts.id=?;
            `,
            [id])
            if (post.length === 0) return null
            return post[0]

        } catch(error) {
            console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
            return {error: error.message}
        }
    }

    static async createPost({ user_id, post }) {
        try {
            const [data, ] = await connection.query(`
            INSERT INTO posts(user_id, post, post_image)
            VALUES
            (?, ?, ?);
            `,
            [user_id, post.post, post.post_image])
            return true
        } catch(error) {
            console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
            return {error: error.message}
        }
    }

    static async deletePost({id, user_id}) {
        try {
            const [data, ] = await connection.query(`
            DELETE FROM posts
            WHERE id=? AND user_id=?;`,
            [id, user_id])
            return true
        } catch(error) {
            console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
            return {error: error.message}
        }
    }
}