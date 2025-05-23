import { makeUpdateTransactionUseCase } from '@/services/factories/make-update-transaction-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateTransaction(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateTransactionParamsSchema = z.object({
    transactionId: z.string().uuid(),
  })

  const updateTransactionBodySchema = z.object({
    title: z.string().optional(),
    amount: z.number().positive('O valor deve ser positivo').optional(),
    type: z.enum(['credit', 'debit']).optional(),
    accomplishment: z.date().optional(),
    category: z.string().optional(),
  })

  const { amount, title, type, accomplishment, category } =
    updateTransactionBodySchema.parse(request.body)

  const { transactionId } = updateTransactionParamsSchema.parse(request.params)

  try {
    const updateTransactionUseCase = makeUpdateTransactionUseCase()

    const { transaction } = await updateTransactionUseCase.execute({
      transactionId,
      title,
      amount,
      type,
      accomplishment,
      category,
    })

    return reply.status(200).send({ transaction })
  } catch (err) {
    return reply.status(500).send()
  }
}
