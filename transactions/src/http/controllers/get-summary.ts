import { makeGetSummaryUseCase } from '@/services/factories/make-get-summary-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function getSummary(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getSummaryUseCase = makeGetSummaryUseCase()

    const { summary } = await getSummaryUseCase.execute({
      userId: request.user.sub,
    })

    return reply.status(200).send({ summary })
  } catch (err) {
    return reply.status(500).send()
  }
}
