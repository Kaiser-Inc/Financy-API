import { prisma } from "@/lib/prisma";
import type { TransactionsRepository } from "../transactions-repository";
import type { Prisma, Transaction } from "@/lib/client";

export class PrismaTransactionsRepository implements TransactionsRepository {
	async save(data: Transaction): Promise<Transaction> {
		const transaction = await prisma.transaction.update({
			where: {
				id: data.id,
			},
			data,
		});
		return transaction;
	}
	async delete(id: string) {
		await prisma.transaction.delete({
			where: {
				id,
			},
		});
	}

	async create(data: Prisma.TransactionUncheckedCreateInput) {
		const transaction = await prisma.transaction.create({
			data,
		});
		return transaction;
	}

	async findById(id: string) {
		const transaction = await prisma.transaction.findUnique({
			where: { id },
		});
		return transaction;
	}
	async getSummaryByUserId(userId: string) {
		const transactionsSummary = await prisma.transaction.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				userId,
			},
		});

		const summary = transactionsSummary._sum.amount;

		return summary;
	}
	async findManyByUserId(userId: string, page: number) {
		const transactions = await prisma.transaction.findMany({
			where: {
				userId,
			},
			take: 20,
			skip: (page - 1) * 20,
		});
		return transactions;
	}
}
