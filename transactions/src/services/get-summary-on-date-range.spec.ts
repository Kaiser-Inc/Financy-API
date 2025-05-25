import { Decimal } from '@/lib/client/runtime/library'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetSummaryOnDateRangeUseCase } from './get-summary-on-date-range'

describe('Get Summary On Date Range Use Case', () => {
  let transactionsRepository: InMemoryTransactionsRepository
  let sut: GetSummaryOnDateRangeUseCase

  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new GetSummaryOnDateRangeUseCase(transactionsRepository)
  })

  it('should be able to get summary within date range', async () => {
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-01-31')

    await transactionsRepository.create({
      id: 'test-1',
      amount: new Decimal(1000),
      title: 'Salário',
      userId: 'user-1',
      accomplishment: new Date('2024-01-15'),
      category: 'geral',
    })

    await transactionsRepository.create({
      id: 'test-2',
      amount: new Decimal(-300),
      title: 'Aluguel',
      userId: 'user-1',
      accomplishment: new Date('2024-01-20'),
      category: 'geral',
    })

    await transactionsRepository.create({
      id: 'test-3',
      amount: new Decimal(500),
      title: 'Freelance',
      userId: 'user-1',
      accomplishment: new Date('2024-02-01'),
      category: 'geral',
    })

    const { summary } = await sut.execute({
      userId: 'user-1',
      startDate,
      endDate,
    })

    expect(summary).toEqual(new Decimal(700))
  })

  it('should return zero when no transactions in date range', async () => {
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-01-31')

    await transactionsRepository.create({
      id: 'test-1',
      amount: new Decimal(1000),
      title: 'Salário',
      userId: 'user-1',
      accomplishment: new Date('2024-02-01'),
      category: 'geral',
    })

    const { summary } = await sut.execute({
      userId: 'user-1',
      startDate,
      endDate,
    })

    expect(summary).toEqual(new Decimal(0))
  })

  it('should only consider transactions from the specified user', async () => {
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-01-31')

    await transactionsRepository.create({
      id: 'test-1',
      amount: new Decimal(1000),
      title: 'Salário User 1',
      userId: 'user-1',
      accomplishment: new Date('2024-01-15'),
      category: 'geral',
    })

    await transactionsRepository.create({
      id: 'test-2',
      amount: new Decimal(2000),
      title: 'Salário User 2',
      userId: 'user-2',
      accomplishment: new Date('2024-01-15'),
      category: 'geral',
    })

    const { summary } = await sut.execute({
      userId: 'user-1',
      startDate,
      endDate,
    })

    expect(summary).toEqual(new Decimal(1000))
  })

  it('should handle transactions exactly on start and end dates', async () => {
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-01-31')

    await transactionsRepository.create({
      id: 'test-1',
      amount: new Decimal(1000),
      title: 'Transação Início',
      userId: 'user-1',
      accomplishment: startDate,
      category: 'geral',
    })

    await transactionsRepository.create({
      id: 'test-2',
      amount: new Decimal(500),
      title: 'Transação Fim',
      userId: 'user-1',
      accomplishment: endDate,
      category: 'geral',
    })

    const { summary } = await sut.execute({
      userId: 'user-1',
      startDate,
      endDate,
    })

    expect(summary).toEqual(new Decimal(1500))
  })
})
