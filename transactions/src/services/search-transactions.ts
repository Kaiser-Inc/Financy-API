import type { Transaction } from '@/lib/client'
import type { TransactionsRepository } from '@/repositories/transactions-repository'

interface SearchTransactionsUseCaseRequest {
  userId: string
  page: number
  query?: string
  startDate?: Date
  endDate?: Date
}

interface SearchTransactionsUseCaseResponse {
  transactions: Transaction[]
}

export class SearchTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    userId,
    page,
    query,
    startDate,
    endDate,
  }: SearchTransactionsUseCaseRequest): Promise<SearchTransactionsUseCaseResponse> {
    const transactions = await this.transactionsRepository.searchMany(
      userId,
      page,
      query,
      startDate,
      endDate,
    )

    return {
      transactions,
    }
  }
}
