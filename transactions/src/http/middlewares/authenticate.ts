import { verify } from '@/lib/axios/auth'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return reply.status(401).send({ error: 'token missing.' })
  }

  const token = authHeader.replace(/^Bearer\s/, '')

  try {
    const { user } = await verify(token)
    request.user = user
  } catch (error) {
    console.error('JWT verification failed: ', error)
    return reply.status(401).send({ error: 'Invalid token.' })
  }
}
