import { Router } from 'express'

export const index = Router()

index.get('/', (_req, res) => {
  return res.render('pages/en/about')
})

index.get('/docs', (_req, res) => {
  return res.render('pages/en/index')
})

index.get('/es', (_req, res) => {
  return res.render('pages/es/about-es')
})

index.get('/docs/es', (_req, res) => {
  return res.render('pages/es/index-es')
})
