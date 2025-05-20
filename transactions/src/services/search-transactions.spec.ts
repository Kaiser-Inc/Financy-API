import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SearchTransactionsUseCase } from './search-transactions'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { Transaction } from '@/lib/client'
import { Decimal } from '@/lib/client/runtime/library'

let transactionsRepository: InMemoryTransactionsRepository
let sut: SearchTransactionsUseCase

describe('Search Transactions Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new SearchTransactionsUseCase(transactionsRepository)
  })

  it('should be able to search transactions', async () => {
    const userId = 'user-1'
    const page = 1

    const mockTransactions: Transaction[] = [
      {
        id: 'transaction-1',
        userId,
        amount: new Decimal(100),
        title: 'Test transaction 1',
        accomplishment: new Date(),
        category: 'test',
      },
      {
        id: 'transaction-2',
        userId,
        amount: new Decimal(200),
        title: 'Test transaction 2',
        accomplishment: new Date(),
        category: 'test',
      },
    ]

    vi.spyOn(transactionsRepository, 'searchMany').mockResolvedValue(mockTransactions)

    const { transactions } = await sut.execute({
      userId,
      page,
    })

    expect(transactions).toHaveLength(2)
    expect(transactions).toEqual(mockTransactions)
    expect(transactionsRepository.searchMany).toHaveBeenCalledWith(userId, page, undefined, undefined, undefined)
  })

  it('should be able to search transactions with filters', async () => {
    const userId = 'user-1'
    const page = 1
    const query = 'test'
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-12-31')

    const mockTransactions: Transaction[] = [
      {
        id: 'transaction-1',
        userId,
        amount: new Decimal(100),
        title: 'Test transaction 1',
        accomplishment: new Date(),
        category: 'test',
      },
    ]

    vi.spyOn(transactionsRepository, 'searchMany').mockResolvedValue(mockTransactions)

    const { transactions } = await sut.execute({
      userId,
      page,
      query,
      startDate,
      endDate,
    })

    expect(transactions).toHaveLength(1)
    expect(transactions).toEqual(mockTransactions)
    expect(transactionsRepository.searchMany).toHaveBeenCalledWith(
      userId,
      page,
      query,
      startDate,
      endDate,
    )
  })

  it('should return empty array when no transactions are found', async () => {
    const userId = 'user-1'
    const page = 1

    vi.spyOn(transactionsRepository, 'searchMany').mockResolvedValue([])

    const { transactions } = await sut.execute({
      userId,
      page,
    })

    expect(transactions).toHaveLength(0)
    expect(transactionsRepository.searchMany).toHaveBeenCalledWith(userId, page, undefined, undefined, undefined)
  })
})