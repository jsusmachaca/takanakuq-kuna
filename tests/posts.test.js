import app from '../src/index'
import request from 'supertest'


describe('GET /api/posts/all', () => {
  test('should respond with a json', async () => {
    await request(app)
      .get('/api/posts/all').send()
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })  
})
