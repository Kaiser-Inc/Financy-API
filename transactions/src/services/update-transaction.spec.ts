import { Decimal } from '@/lib/client/runtime/library'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UpdateTransactionUseCase } from './update-transaction'

describe('Update Transaction Use Case', () => {
  let transactionsRepository: InMemoryTransactionsRepository
  let sut: UpdateTransactionUseCase

  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new UpdateTransactionUseCase(transactionsRepository)
  })

  it('should be able to update a transaction title', async () => {
    const transaction = await transactionsRepository.create({
      id: 'test-1',
      amount: new Decimal(1000),
      title: 'Salário',
      userId: 'user-1',
      accomplishment: new Date(),
      category: 'geral',
    })

    const { transaction: updatedTransaction } = await sut.execute({
      transactionId: transaction.id,
      title: 'Salário Atualizado',
    })

    expect(updatedTransaction.title).toBe('Salário Atualizado')
    expect(updatedTransaction.amount).toEqual(transaction.amount)
  })

  it('should be able to update a transaction category', async () => {
    const transaction = await transactionsRepository.create({
      id: 'test-1',
      amount: new Decimal(1000),
      title: 'Salário',
      userId: 'user-1',
      accomplishment: new Date(),
      category: 'geral',
    })

    const { transaction: updatedTransaction } = await sut.execute({
      transactionId: transaction.id,
      category: 'algo',
    })

    expect(updatedTransaction.category).toBe('algo')
    expect(updatedTransaction.amount).toEqual(transaction.amount)
  })

  it('should be able to update a transaction amount', async () => {
    const transaction = await transactionsRepository.create({
      id: 'test-1',
      amount: new Decimal(1000),
      title: 'Salário',
      userId: 'user-1',
      accomplishment: new Date(),
      category: 'geral',
    })

    const { transaction: updatedTransaction } = await sut.execute({
      transactionId: transaction.id,
      amount: 2000,
      type: 'credit',
    })

    expect(Number(updatedTransaction.amount)).toBe(2000)
    expect(updatedTransaction.title).toBe(transaction.title)
  })

  it('should be able to update a transaction date', async () => {
    const originalDate = new Date('2024-01-01')
    const newDate = new Date('2024-02-01')

    const transaction = await transactionsRepository.create({
      id: 'test-1',
      amount: new Decimal(1000),
      title: 'Salário',
      userId: 'user-1',
      accomplishment: originalDate,
      category: 'geral',
    })

    const { transaction: updatedTransaction } = await sut.execute({
      transactionId: transaction.id,
      accomplishment: newDate,
    })

    expect(updatedTransaction.accomplishment).toEqual(newDate)
    expect(updatedTransaction.title).toBe(transaction.title)
    expect(updatedTransaction.amount).toEqual(transaction.amount)
  })

  it('should be able to update multiple fields at once', async () => {
    const originalDate = new Date('2024-01-01')
    const newDate = new Date('2024-02-01')

    const transaction = await transactionsRepository.create({
      id: 'test-1',
      amount: new Decimal(1000),
      title: 'Salário',
      userId: 'user-1',
      accomplishment: originalDate,
      category: 'geral',
    })

    const { transaction: updatedTransaction } = await sut.execute({
      transactionId: transaction.id,
      title: 'Salário Atualizado',
      amount: 3000,
      type: 'credit',
      accomplishment: newDate,
    })

    expect(updatedTransaction.title).toBe('Salário Atualizado')
    expect(Number(updatedTransaction.amount)).toBe(3000)
    expect(updatedTransaction.accomplishment).toEqual(newDate)
  })

  it('should throw an error when trying to update a non-existent transaction', async () => {
    await expect(
      sut.execute({
        transactionId: 'non-existent-id',
        title: 'Novo Título',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should update amount to negative when type is debit', async () => {
    const transaction = await transactionsRepository.create({
      id: 'test-1',
      amount: new Decimal(1000),
      title: 'Salário',
      userId: 'user-1',
      accomplishment: new Date(),
      category: 'geral',
    })

    const { transaction: updatedTransaction } = await sut.execute({
      transactionId: transaction.id,
      amount: 2000,
      type: 'debit',
    })

    expect(Number(updatedTransaction.amount)).toBe(-2000)
  })

  it('should infer type from current amount when type is not provided', async () => {
    const transaction = await transactionsRepository.create({
      id: 'test-1',
      amount: new Decimal(-1000),
      title: 'Despesa',
      userId: 'user-1',
      accomplishment: new Date(),
      category: 'geral',
    })

    const { transaction: updatedTransaction } = await sut.execute({
      transactionId: transaction.id,
      amount: 2000,
    })

    expect(Number(updatedTransaction.amount)).toBe(-2000)
  })

  it('should infer type from current amount when type is not provided for credit transaction', async () => {
    const transaction = await transactionsRepository.create({
      id: 'test-1',
      amount: new Decimal(1000),
      title: 'Receita',
      userId: 'user-1',
      accomplishment: new Date(),
      category: 'geral',
    })

    const { transaction: updatedTransaction } = await sut.execute({
      transactionId: transaction.id,
      amount: 2000,
    })

    expect(Number(updatedTransaction.amount)).toBe(2000)
  })
})
