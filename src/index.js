/*
* Author: jsusmachaca
*/
import { corsMiddleware } from './middlewares/cors.js'
import express, { json, static as static_ } from 'express'
import { users } from './routes/users.js'
import dotenv from 'dotenv'
import { posts } from './routes/posts.js'
import path from 'node:path'
import { fileURLToPath  } from 'node:url'
import { recipes } from './routes/recipes.js'



const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express()

app.use(json())
app.use(corsMiddleware())
app.use(static_(path.join(__dirname, 'public')))


app.use('/api/user', users)
app.use('/api/posts', posts)
app.use('/api/recipe', recipes)



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`\x1b[33mserver listening on port ${PORT}\x1b[0m`)
})