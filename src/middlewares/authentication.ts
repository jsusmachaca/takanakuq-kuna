import { Response, NextFunction } from "express"
import { validateToken } from "../config/config"
import { AuthRequest } from "../types/global"

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization
    if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

    const token = authorization.substring(7)
    const validation = validateToken(token)

    if (validation === null) throw new Error('invalid token')

    req.authUser = validation
    return next()
  } catch (err) {
    return res.status(401).json({ error: (err as Error).message })
  }
}
