import { JwtPayload } from "jsonwebtoken"
import { Request } from "express"

export interface jwtData extends JwtPayload{
  user_id: number
  username: string
  is_admin: boolean
  is_staff: boolean
}

export interface commentData {
  user_id?: number
  comment_id?: number
  post_id?: number
  comment?: string
}

export interface AuthRequest extends Request {
  authUser?: jwtData
}