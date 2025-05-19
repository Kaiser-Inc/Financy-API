import type { Prisma, Transaction } from '@/lib/client'
import type { Decimal } from '@/lib/client/runtime/library'

export interface FilterOptions {
  userId: string
  query?: string
  startDate?: Date
  endDate?: Date
}

export interface TransactionsRepository {
  create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>
  findById(id: string): Promise<Transaction | null>
  getSummaryByUserId(userId: string): Promise<Decimal>
  getSummaryByUserIdOnDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Decimal>
  findManyByUserId(userId: string, page: number): Promise<Transaction[]>
  delete(id: string): Promise<void>
  save(transaction: Transaction): Promise<Transaction>
  searchMany(
    userId: string,
    page: number,
    query?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Transaction[]>
}
