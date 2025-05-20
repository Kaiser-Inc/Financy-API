import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { GetSummaryOnDateRangeUseCase } from '../get-summary-on-date-range'

export function makeGetSummaryOnDateRangeUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const useCase = new GetSummaryOnDateRangeUseCase(transactionsRepository)

  return useCase
}
