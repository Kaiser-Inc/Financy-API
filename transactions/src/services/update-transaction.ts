import type { Transaction } from '@/lib/client'
import { Decimal } from '@/lib/client/runtime/library'
import type { TransactionsRepository } from '@/repositories/transactions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface UpdateTransactionUseCaseRequest {
  transactionId: string
  title?: string
  amount?: number
  type?: 'credit' | 'debit'
  accomplishment?: Date
  category?: string
}

interface UpdateTransactionUseCaseResponse {
  transaction: Transaction
}

export class UpdateTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    transactionId,
    accomplishment,
    amount,
    title,
    type,
    category,
  }: UpdateTransactionUseCaseRequest): Promise<UpdateTransactionUseCaseResponse> {
    const transaction =
      await this.transactionsRepository.findById(transactionId)

    if (!transaction) {
      throw new ResourceNotFoundError()
    }

    transaction.title = title ? title : transaction.title
    transaction.category = category ? category : transaction.category

    if (amount !== undefined) {
      const transactionType =
        type || (transaction.amount.isNegative() ? 'debit' : 'credit')
      transaction.amount = new Decimal(
        transactionType === 'credit' ? amount : amount * -1,
      )
    }
    transaction.accomplishment = accomplishment
      ? accomplishment
      : transaction.accomplishment

    await this.transactionsRepository.save(transaction)

    return { transaction }
  }
}
