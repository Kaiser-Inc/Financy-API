import type { FastifyInstance } from 'fastify'
import { authenticate } from '../controllers/authenticate'
import { profile } from '../controllers/profile'
import { refresh } from '../controllers/refresh'
import { register } from '../controllers/register'
import { verifyJWT } from '../middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/session', authenticate)

  app.post('/token/refresh', refresh)

  app.get('/me', { onRequest: [verifyJWT] }, profile)

  app.post(
    '/token/verify',
    { preHandler: [verifyJWT] },
    async (request, reply) => {
      return { user: request.user }
    },
  )
}
