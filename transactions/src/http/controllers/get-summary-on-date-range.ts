import { makeGetSummaryOnDateRangeUseCase } from '@/services/factories/make-get-sumary-on-date-range-use-case'
import dayjs from 'dayjs'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getSummaryOnDateRange(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const summaryQuerySchema = z.object({
      startDate: z
        .string(),
      endDate: z
        .string(),
    })

    const { startDate, endDate } = summaryQuerySchema.parse(request.query)

    const getSummaryOnDateRangeUseCase = makeGetSummaryOnDateRangeUseCase()

    const { summary } = await getSummaryOnDateRangeUseCase.execute({
      userId: request.user.sub,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })

    return reply.status(200).send({ summary })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: err instanceof Error ? err.message : 'Unknown error',
    })
  }
}
