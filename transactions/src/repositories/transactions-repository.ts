import type { Prisma, Transaction } from '@/lib/client'
import type { Decimal } from '@/lib/client/runtime/library'

export interface TransactionsRepository {
  create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>
  findById(id: string): Promise<Transaction | null>
  getSummaryByUserId(userId: string): Promise<Decimal | null>
  findManyByUserId(userId: string, page: number): Promise<Transaction[]>
  delete(id: string): Promise<void>
  save(transaction: Transaction): Promise<Transaction>
}
