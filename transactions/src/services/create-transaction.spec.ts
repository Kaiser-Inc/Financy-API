import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateTransactionUseCase } from './create-transaction'

describe('Create Transaction Use Case', () => {
  let transactionsRepository: InMemoryTransactionsRepository
  let sut: CreateTransactionUseCase

  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new CreateTransactionUseCase(transactionsRepository)
  })

  it('should be able to create a credit transaction', async () => {
    const { transaction } = await sut.execute({
      title: 'Salário',
      amount: 5000,
      type: 'credit',
      category: 'geral',
      userId: 'user-1',
    })

    expect(transaction.id).toBeDefined()
    expect(transaction.title).toBe('Salário')
    expect(transaction.amount).toBe(5000)
    expect(transaction.userId).toBe('user-1')
  })

  it('should be able to create a debit transaction', async () => {
    const { transaction } = await sut.execute({
      title: 'Aluguel',
      amount: 1500,
      type: 'debit',
      category: 'geral',
      userId: 'user-1',
    })

    expect(transaction.id).toBeDefined()
    expect(transaction.title).toBe('Aluguel')
    expect(transaction.amount).toBe(-1500) // Valor negativo para débito
    expect(transaction.userId).toBe('user-1')
  })
})
