import { Decimal } from "@/lib/client/runtime/library";
import type { TransactionsRepository } from "../transactions-repository";
import type { Transaction } from "@/lib/client";
import { randomUUID } from "node:crypto";
import { T } from "vitest/dist/chunks/reporters.d.DG9VKi4m";

export class InMemoryTransactionsRepository implements TransactionsRepository {
	public items: Transaction[] = [];

	async findById(id: string) {
		const transaction = await this.items.find((item) => item.id === id);

		if (!transaction) {
			return null;
		}

		return transaction;
	}

	async getSummaryByUserId(userId: string) {
		const userTransactions = await this.items.filter(
			(item) => item.userId === userId,
		);

		const summary = userTransactions.reduce(
			(acc, transaction) => {
				if (transaction.amount.toNumber() > 0) {
					acc.income += transaction.amount.toNumber();
				} else {
					acc.outcome += Math.abs(transaction.amount.toNumber());
				}
				return acc;
			},
			{ income: 0, outcome: 0 },
		);
		return new Decimal(summary.income - summary.outcome);
	}

	async findManyByUserId(userId: string, page: number) {
		return this.items
			.filter((checkIn) => checkIn.userId === userId)
			.slice((page - 1) * 20, page * 20);
	}

	async create(data: Transaction) {
		const transaction: Transaction = {
			id: data.id ? data.id : randomUUID(),
			amount: data.amount,
			title: data.title,
			userId: data.userId ? data.userId : "Kaiser",
		};

		this.items.push(transaction);

		return transaction;
	}
}
