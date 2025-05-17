import type { Prisma, Transaction,  } from '@/../prisma/client'
import type { Decimal } from 'prisma/client/runtime/library'



export interface TransactionsRepository {
  create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>
  findById(id: string): Promise<Transaction | null>
  getSummaryByUserId(userId: string): Promise<Decimal | null>
  findManyByUserId(userId: string, page: number): Promise<Transaction[]>
}
