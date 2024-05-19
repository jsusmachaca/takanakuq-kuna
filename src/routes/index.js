import { Router } from 'express'

export const index = Router()

index.get('/', (req, res) => {
  return res.render('pages/index')
})

index.get('/about', (req, res) => {
  return res.render('pages/about')
})
