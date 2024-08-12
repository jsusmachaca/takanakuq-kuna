import { Request, Response, NextFunction } from "express"

export const authentication = (_req: Request, _res: Response, next: NextFunction) => {
  next()
}
