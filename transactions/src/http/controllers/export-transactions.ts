import { makeExportTransactionsUseCase } from '@/services/factories/make-export-transactions'
import { makeFetchTransactionsUseCase } from '@/services/factories/make-fetch-transactions'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function exportTransactions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const fetchTransactionsUseCase = makeExportTransactionsUseCase()

    const { buffer, filename } = await fetchTransactionsUseCase.execute({
      userId: request.user.sub,
    })

    return reply
      .status(200)
      .header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .send(buffer)
  } catch (err) {
    return reply.status(500).send()
  }
}
