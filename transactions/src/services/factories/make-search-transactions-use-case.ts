import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { SearchTransactionsUseCase } from '../search-transactions'

export function makeSearchTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const useCase = new SearchTransactionsUseCase(transactionsRepository)

  return useCase
}
