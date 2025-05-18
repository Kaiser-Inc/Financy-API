import type { TransactionsRepository } from "@/repositories/transactions-repository";
import type { Transaction } from "@/lib/client";
import { randomUUID } from "node:crypto";

interface CreateTransactionUseCaseRequest {
	title: string;
	amount: number;
	type: "credit" | "debit";
	userId: string;
	accomplishment?: Date;
}

interface CreateTransactionUseCaseResponse {
	transaction: Transaction;
}

export class CreateTransactionUseCase {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({
		title,
		amount,
		type,
		userId,
		accomplishment,
	}: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
		const transaction = await this.transactionsRepository.create({
			id: randomUUID(),
			title,
			amount: type === "credit" ? amount : amount * -1,
			accomplishment,
			userId,
		});
		return { transaction };
	}
}
