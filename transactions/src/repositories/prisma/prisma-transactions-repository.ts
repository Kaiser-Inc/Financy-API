import { Prisma, Transaction } from '@/lib/client'
import { prisma } from '@/lib/prisma'
import type {
  FilterOptions,
  TransactionsRepository,
} from '../transactions-repository'

export class PrismaTransactionsRepository implements TransactionsRepository {
  async getSummaryByUserIdOnDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const transactionsSummary = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId,
        accomplishment: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const summary = transactionsSummary._sum.amount ?? new Prisma.Decimal(0)

    return summary
  }
  async searchMany(
    userId: string,
    page: number,
    query?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        ...(query && {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        }),
        ...(startDate &&
          endDate && {
            accomplishment: {
              gte: startDate,
              lte: endDate,
            },
          }),
      },
      orderBy: {
        accomplishment: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return transactions
  }

  async save(data: Transaction): Promise<Transaction> {
    const transaction = await prisma.transaction.update({
      where: {
        id: data.id,
      },
      data,
    })
    return transaction
  }
  async delete(id: string) {
    await prisma.transaction.delete({
      where: {
        id,
      },
    })
  }

  async create(data: Prisma.TransactionUncheckedCreateInput) {
    const transaction = await prisma.transaction.create({
      data,
    })
    return transaction
  }

  async findById(id: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    })
    return transaction
  }
  async getSummaryByUserId(userId: string) {
    const transactionsSummary = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId,
      },
    })

    const summary = transactionsSummary._sum.amount ?? new Prisma.Decimal(0)

    return summary
  }
  async findManyByUserId(userId: string, page: number) {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      ...(page &&
        page > 0 && {
          take: 20,
          skip: (page - 1) * 20,
        }),
    })
    return transactions
  }
}
