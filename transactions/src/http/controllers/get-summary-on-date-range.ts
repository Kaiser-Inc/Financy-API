import { makeGetSummaryOnDateRangeUseCase } from '@/services/factories/make-get-sumary-on-date-range-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getSummaryOnDateRange(request: FastifyRequest, reply: FastifyReply) {
  try {

    const transactionsQuerySchema = z.object({
        startDate: z.date().default(new Date('2004-11-25')),
        endDate: z.date().default(new Date('3041-11-25')),
      })

    const { startDate, endDate } = transactionsQuerySchema.parse(request.query)


    const getSummaryOnDateRangeUseCase = makeGetSummaryOnDateRangeUseCase()

    const { summary } = await getSummaryOnDateRangeUseCase.execute({
      userId: request.user.sub,
      startDate,
      endDate
    })

    return reply.status(200).send({ summary })
  } catch (err) {
    return reply.status(500).send()
  }
}
