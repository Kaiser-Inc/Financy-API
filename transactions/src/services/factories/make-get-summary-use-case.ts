import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { GetSummaryUseCase } from '../get-summary'

export function makeGetSummaryUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const useCase = new GetSummaryUseCase(transactionsRepository)

  return useCase
}
