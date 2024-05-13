import { Router } from 'express'


export const index = Router()

index.get('/', (req, res) => {
  return res.render('index')
})