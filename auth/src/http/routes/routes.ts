import type { FastifyInstance } from 'fastify'
import { register } from '../controlers/register'
import { authenticate } from '../controlers/authenticate'
import { refresh } from '../controlers/refresh'
import { profile } from '../controlers/profile'
import { verifyJWT } from '../middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/session', authenticate)

  app.post('/token/refresh', refresh)

  app.get('/me', {onRequest: [verifyJWT]} , profile)
}
