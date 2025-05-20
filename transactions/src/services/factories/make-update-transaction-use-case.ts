import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { UpdateTransactionUseCase } from '../update-transaction'

export function makeUpdateTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const useCase = new UpdateTransactionUseCase(transactionsRepository)

  return useCase
}
