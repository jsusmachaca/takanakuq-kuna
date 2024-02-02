import { dbConnectionPg } from "../../config/config.js";

const connection = await dbConnectionPg()


export class post {
    static async getAll() {
        try {
            const { rows } = await connection.query(`
            SELECT posts.id, users.username, profile.profile_image, posts.post, posts.post_image, posts.date_publish
            FROM posts 
            JOIN users 
            ON posts.user_id=users.id
            JOIN profile
            ON posts.user_id=profile.user_id

            ORDER BY posts.id;
            `)
            return rows
        } catch(error) {
            console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
            return {error: error.message}
        }
    }

    static async findByUser(id) {
        try {
            const { rows } = await connection.query(`
            SELECT profile.profile_image, posts.post, posts.post_image, posts.date_publish
            FROM posts
            JOIN profile
            ON posts.user_id=profile.user_id
            WHERE posts.user_id=$1;
            `,
            [id])
            return rows
        } catch(error) {
            console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
            return {error: error.message}
        }
    }

    static async findById(id) {
        try {
            const { rows } = await connection.query(`
            SELECT users.username, profile.profile_image, posts.post, posts.post_image, posts.date_publish
            FROM posts
            JOIN users
            ON posts.user_id=users.id
            JOIN profile
            ON posts.user_id=profile.user_id
            WHERE posts.id=$1;
            `,
            [id])
            if (rows.length === 0) return null
            return rows[0]

        } catch(error) {
            console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
            return {error: error.message}
        }
    }

    static async createPost({ user_id, post }) {
        try {
            const { rows } = await connection.query(`
            INSERT INTO posts(user_id, post, post_image)
            VALUES
            ($1, $2, $3);
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
            const { rows } = await connection.query(`
            DELETE FROM posts
            WHERE id=$1 AND user_id=$2;`,
            [id, user_id])
            return true
        } catch(error) {
            console.error(`\x1b[31man error occurred ${error}\x1b[0m`)
            return {error: error.message}
        }
    }
}