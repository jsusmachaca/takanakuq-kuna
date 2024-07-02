import { validateToken } from '../../config/config.js'

export const socketAuthorization = (socket, next) => {
  const token = socket.handshake.headers.token
  if (!token) {
    return next(new Error('authentication error'))
  }
  const validate = validateToken(token)

  if (validate === null) return next(new Error('authentication error'))
    
  socket.user = validate.username
  return next()
}