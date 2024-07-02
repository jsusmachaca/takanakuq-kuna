/*
 * Authors: jsusmachaca, carlos123-a, RampageWallE, eljow
 */
import { PORT, ACCEPTED_ORIGINS } from './config/config.js'
import express, { json, static as static_ } from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { corsMiddleware } from './middlewares/cors.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { users } from './routes/users.js'
import { posts } from './routes/posts.js'
import { recipes } from './routes/recipes.js'
import { comments } from './routes/comments.js'
import { index } from './routes/index.js'
import { socketAuthorization } from './websockets/middlewares/authorization.js'
import { sockets } from './websockets/sockets.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: ACCEPTED_ORIGINS
  }
})

// WebSocket middleware authorization
io.use(socketAuthorization)

app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware())
app.use(errorHandler)
app.use(static_(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// API routes
app.use('/api/user', users)
app.use('/api/posts', posts)
app.use('/api/recipe', recipes)
app.use('/api/comments', comments)
app.use('/', index)

// WebSockets implementation
sockets(io)

server.listen(PORT, () => {
  console.log(`\x1b[32mserver listening on port ${PORT}\x1b[0m`)
})

// descoment for testing
// export default app
