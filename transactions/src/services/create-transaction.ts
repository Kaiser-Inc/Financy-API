import { randomUUID } from 'node:crypto'
import type { Transaction } from '@/lib/client'
import type { TransactionsRepository } from '@/repositories/transactions-repository'

interface CreateTransactionUseCaseRequest {
  title: string
  amount: number
  type: 'credit' | 'debit'
  userId: string
  accomplishment?: Date
  category: string
}

interface CreateTransactionUseCaseResponse {
  transaction: Transaction
}

export class CreateTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    title,
    amount,
    type,
    userId,
    accomplishment,
    category,
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const transaction = await this.transactionsRepository.create({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      accomplishment,
      category,
      userId,
    })
    return { transaction }
  }
}
