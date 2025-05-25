import { makeSearchTransactionUseCase } from '@/services/factories/make-search-transactions-use-case'
import dayjs from 'dayjs'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function searchTransactions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const transactionsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    query: z.string().optional(),
    startDate: z
        .string(),
      endDate: z
        .string(),
  })

  const { page, query, startDate, endDate } = transactionsQuerySchema.parse(
    request.query,
  )

  try {
    const searchTransactionsUseCase = makeSearchTransactionUseCase()

    const { transactions } = await searchTransactionsUseCase.execute({
      userId: request.user.sub,
      page,
      query,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })

    return reply.status(200).send({ transactions })
  } catch (err) {
    return reply.status(500).send()
  }
}
