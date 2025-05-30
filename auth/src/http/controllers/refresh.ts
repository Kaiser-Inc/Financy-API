import type { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const token = await reply.jwtSign(
    {
      name: request.user.name,
    },
    {
      sub: request.user.sub,
    },
  )

  const refreshToken = await reply.jwtSign(
    {
      name: request.user.name,
    },
    {
      sub: request.user.sub,
      expiresIn: '7d',
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: false,
      sameSite: 'none',
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    })
}
