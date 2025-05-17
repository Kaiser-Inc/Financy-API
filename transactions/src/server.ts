import { app } from './app'
import { env } from './env/index'

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`http server running at http://localhost:${env.PORT}`)
  })
