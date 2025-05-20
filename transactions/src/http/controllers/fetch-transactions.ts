import { makeFetchTransactionsUseCase } from '@/services/factories/make-fetch-transactions-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchTransactions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const transactionsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = transactionsQuerySchema.parse(request.query)

  try {
    const fetchTransactionsUseCase = makeFetchTransactionsUseCase()

    const { transactions } = await fetchTransactionsUseCase.execute({
      userId: request.user.sub,
      page,
    })

    return reply.status(200).send({ transactions })
  } catch (err) {
    return reply.status(500).send()
  }
}
