import { makeCreateTransactionUseCase } from '@/services/factories/make-create-transaction'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createTransaction(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createTransactionBodySchema = z.object({
    title: z.string().min(1, 'O título é obrigatório'),
    amount: z.number().positive('O valor deve ser positivo'),
    type: z.enum(['credit', 'debit']),
    accomplishment: z.date().default(new Date()),
    category: z.string().min(1, 'A categoria é obrigatória'),
  })

  const { amount, title, type, accomplishment, category } =
    createTransactionBodySchema.parse(request.body)

  try {
    const createTransactionUseCase = makeCreateTransactionUseCase()

    const { transaction } = await createTransactionUseCase.execute({
      amount,
      title,
      type,
      accomplishment,
      category,
      userId: request.user.sub,
    })
    return reply.status(201).send(transaction)
  } catch (err) {
    return reply.status(500).send()
  }
}
