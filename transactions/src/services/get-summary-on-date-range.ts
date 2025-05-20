import type { Decimal } from '@/lib/client/runtime/library'
import type { TransactionsRepository } from '@/repositories/transactions-repository'

interface GetSummaryOnDateRangeUseCaseRequest {
  userId: string
  startDate: Date
  endDate: Date
}

interface GetSummaryOnDateRangeUseCaseResponse {
  summary: Decimal
}

export class GetSummaryOnDateRangeUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    userId,
    startDate,
    endDate,
  }: GetSummaryOnDateRangeUseCaseRequest): Promise<GetSummaryOnDateRangeUseCaseResponse> {
    const summary =
      await this.transactionsRepository.getSummaryByUserIdOnDateRange(
        userId,
        startDate,
        endDate,
      )

    return { summary }
  }
}
