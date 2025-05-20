import { makeDeleteTransactionUseCase } from '@/services/factories/make-delete-transaction-use-case'
import { makeGetTransactionUseCase } from '@/services/factories/make-get-transactions-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteTransaction(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const transactionParamsSchema = z.object({
    transactionId: z.string().uuid(),
  })

  const { transactionId } = transactionParamsSchema.parse(request.params)

  try {
    const getTransactionUseCase = makeDeleteTransactionUseCase()

    await getTransactionUseCase.execute({
      transactionId,
    })

    return reply.status(204).send()
  } catch (err) {
    return reply.status(500).send()
  }
}
