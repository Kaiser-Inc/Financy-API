import { Decimal } from '@/lib/client/runtime/library'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getTransactionUseCase } from './get-transaction'

describe('Get Transaction Use Case', () => {
  let transactionsRepository: InMemoryTransactionsRepository
  let sut: getTransactionUseCase

  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new getTransactionUseCase(transactionsRepository)
  })

  it('should be able to get a transaction by id', async () => {
    const createdTransaction = await transactionsRepository.create({
      id: 'test-1',
      amount: new Decimal(1000),
      title: 'test transaction',
      userId: 'user-1',
      accomplishment: new Date(),
      category: 'geral',
    })

    const { transaction } = await sut.execute({
      transactionId: createdTransaction.id,
    })

    expect(transaction).toEqual(
      expect.objectContaining({
        id: 'test-1',
        amount: new Decimal(1000),
        title: 'test transaction',
        userId: 'user-1',
      }),
    )
  })

  it('should throw ResourceNotFoundError when transaction does not exist', async () => {
    await expect(
      sut.execute({
        transactionId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
