import cookie from '@fastify/cookie'
import { fastify } from 'fastify'
import authProxy from './http/routes/auth-proxy'
import { appRoutes } from './http/routes/routes'

export const app = fastify()

app.register(cookie)
app.register(authProxy)
app.register(appRoutes)
