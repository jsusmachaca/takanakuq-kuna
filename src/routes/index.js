import { Router } from 'express'

export const index = Router()

index.get('/', (req, res) => {
  return res.render('pages/en/about')
})

index.get('/docs', (req, res) => {
  return res.render('pages/en/index')
})

index.get('/es', (req, res) => {
  return res.render('pages/es/about-es')
})

index.get('/docs/es', (req, res) => {
  return res.render('pages/es/index-es')
})
