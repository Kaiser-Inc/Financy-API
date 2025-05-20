import { Decimal } from '@/lib/client/runtime/library'
import { prisma } from '@/lib/prisma'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteTransactionUseCase } from './delete-transaction'

describe('Delete Transaction Use Case', () => {
  let transactionsRepository: InMemoryTransactionsRepository
  let sut: DeleteTransactionUseCase

  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new DeleteTransactionUseCase(transactionsRepository)
  })

  it('should be able to delete a transaction', async () => {
    const createdTransaction = await transactionsRepository.create({
      id: 'test-1',
      amount: new Decimal(1000),
      title: 'Salário',
      userId: 'user-1',
      accomplishment: new Date(),
      category: 'geral',
    })

    await sut.execute({
      transactionId: createdTransaction.id,
    })

    expect(transactionsRepository.items).toHaveLength(0)
  })
})
