import { env } from '@/env'
import fastifyHttpProxy from '@fastify/http-proxy'
import fp from 'fastify-plugin'

export default fp(async (app) => {
  app.register(fastifyHttpProxy, {
    upstream: env.AUTH_SERVICE_URL,
    prefix: '/auth',
    rewritePrefix: '',
    http2: false,
  })
})
