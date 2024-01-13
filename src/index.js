/*
* Author: jsusmachaca
*/
import { corsMiddleware } from './middlewares/cors.js'
import express, { json } from 'express'
import { users } from './routes/users.js'
import dotenv from 'dotenv'
import { posts } from './routes/posts.js'

dotenv.config()
const app = express()

app.use(json())
app.use(corsMiddleware())


app.use('/api/user', users)
app.use('/api/posts', posts)



const PORT = process.env.SERVER_PORT
app.listen(PORT, () => {
    console.log(`\x1b[33mserver listening on port ${PORT}\x1b[0m`)
})