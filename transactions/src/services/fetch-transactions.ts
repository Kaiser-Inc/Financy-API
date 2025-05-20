import type { Transaction } from '@/lib/client'
import type { TransactionsRepository } from '@/repositories/transactions-repository'

interface FetchTransactionsUseCaseRequest {
  userId: string
  page: number
}

interface FetchTransactionsUseCaseResponse {
  transactions: Transaction[]
}

export class FetchTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    userId,
    page,
  }: FetchTransactionsUseCaseRequest): Promise<FetchTransactionsUseCaseResponse> {
    const transactions = await this.transactionsRepository.findManyByUserId(
      userId,
      page,
    )
    return { transactions }
  }
}
