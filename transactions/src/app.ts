import cookie from '@fastify/cookie'
import { fastify } from 'fastify'
import { transactionRoutes } from './http/routes/transactionRoutes'

export const app = fastify()

app.register(cookie)
app.register(transactionRoutes, {
  prefix: '/transactions',
})
