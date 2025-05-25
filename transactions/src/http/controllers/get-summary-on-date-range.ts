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
        .string()
        .transform((date) => dayjs(date).startOf('day').toDate())
        .refine((date) => dayjs(date).isValid(), {
          message: 'Data inicial inválida',
        })
        .default(dayjs().startOf('year').format('YYYY-MM-DD')),
      endDate: z
        .string()
        .transform((date) => dayjs(date).endOf('day').toDate())
        .refine((date) => dayjs(date).isValid(), {
          message: 'Data final inválida',
        })
        .default(dayjs().endOf('day').format('YYYY-MM-DD')),
    })

    const { startDate, endDate } = summaryQuerySchema.parse(request.query)

    const getSummaryOnDateRangeUseCase = makeGetSummaryOnDateRangeUseCase()

    const { summary } = await getSummaryOnDateRangeUseCase.execute({
      userId: request.user.sub,
      startDate,
      endDate,
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
