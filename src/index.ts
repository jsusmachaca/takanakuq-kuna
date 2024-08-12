/*
 * Authors: jsusmachaca, carlos123-a, RampageWallE, eljow
 */
import { PORT } from './config/config'
import express, { json, static as static_ } from 'express'
import { corsMiddleware } from './middlewares/cors'
import { errorHandler } from './middlewares/errorHandler'
import path from 'node:path'

import { users } from './routes/users'
import { posts } from './routes/posts'
import { recipes } from './routes/recipes'
import { comments } from './routes/comments'
import { index } from './routes/index'

const app = express()


app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware())
app.use(errorHandler)
app.use(static_(path.join(process.cwd(), 'src', 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(process.cwd(), 'src', 'views'))

// API routes
app.use('/api/user', users)
app.use('/api/posts', posts)
app.use('/api/recipe', recipes)
app.use('/api/comments', comments)
app.use('/', index)


app.listen(PORT, () => {
  console.log(`\x1b[32mserver listening on port ${PORT}\x1b[0m`)
})

// descoment for testing
// export default app
