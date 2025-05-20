import { randomUUID } from 'node:crypto'
import { Prisma, type Transaction } from '@/lib/client'
import { Decimal } from '@/lib/client/runtime/library'
import type { TransactionsRepository } from '../transactions-repository'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  async getSummaryByUserIdOnDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const userTransactions = await this.items.filter(
      (item) =>
        item.userId === userId &&
        new Date(item.accomplishment) >= startDate &&
        new Date(item.accomplishment) <= endDate,
    )

    const summary = userTransactions.reduce(
      (acc, transaction) => {
        if (transaction.amount.toNumber() > 0) {
          acc.income += transaction.amount.toNumber()
        } else {
          acc.outcome += Math.abs(transaction.amount.toNumber())
        }
        return acc
      },
      { income: 0, outcome: 0 },
    )
    return new Decimal(summary.income - summary.outcome)
  }
  public items: Transaction[] = []

  async searchMany(
    userId: string,
    page: number,
    query?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    return this.items.filter((transaction) => {
      if (transaction.userId !== userId) return false

      const matchesQuery = query
        ? transaction.title.toLowerCase().includes(query.toLowerCase()) ||
          transaction.category.toLowerCase().includes(query.toLowerCase())
        : true

      const matchesDateRange =
        startDate && endDate
          ? new Date(transaction.accomplishment) >= startDate &&
            new Date(transaction.accomplishment) <= endDate
          : true

      return matchesQuery && matchesDateRange
    })
  }

  async save(transaction: Transaction) {
    const index = this.items.findIndex((item) => item.id === transaction.id)

    if (index >= 0) {
      this.items[index] = transaction
    }

    return transaction
  }
  async delete(id: string) {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }

  async findById(id: string) {
    const transaction = await this.items.find((item) => item.id === id)

    if (!transaction) {
      return null
    }

    return transaction
  }

  async getSummaryByUserId(userId: string) {
    const userTransactions = await this.items.filter(
      (item) => item.userId === userId,
    )

    const summary = userTransactions.reduce(
      (acc, transaction) => {
        if (transaction.amount.toNumber() > 0) {
          acc.income += transaction.amount.toNumber()
        } else {
          acc.outcome += Math.abs(transaction.amount.toNumber())
        }
        return acc
      },
      { income: 0, outcome: 0 },
    )
    return new Decimal(summary.income - summary.outcome)
  }

  async findManyByUserId(userId: string, page: number) {
    const userTransactions = this.items.filter(
      (checkIn) => checkIn.userId === userId,
    )

    if (page === 0) {
      return userTransactions
    }

    return userTransactions.slice((page - 1) * 20, page * 20)
  }

  async create(data: Transaction) {
    const transaction: Transaction = {
      id: data.id ? data.id : randomUUID(),
      title: data.title,
      amount: data.amount,
      accomplishment: data.accomplishment ? data.accomplishment : new Date(),
      category: data.category ? data.category : 'Geral',
      userId: data.userId ? data.userId : 'Kaiser',
    }

    this.items.push(transaction)

    return transaction
  }
}
