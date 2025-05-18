import type { TransactionsRepository } from "@/repositories/transactions-repository";
import type { Transaction } from "@/lib/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { Decimal } from "@/lib/client/runtime/library";

interface UpdateTransactionUseCaseRequest {
	transactionId: string;
	title?: string;
	amount?: number;
	type?: "credit" | "debit";
	accomplishment?: Date;
}

interface UpdateTransactionUseCaseResponse {
	transaction: Transaction;
}

export class UpdateTransactionUseCase {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({
		transactionId,
		accomplishment,
		amount,
		title,
		type,
	}: UpdateTransactionUseCaseRequest): Promise<UpdateTransactionUseCaseResponse> {
		const transaction =
			await this.transactionsRepository.findById(transactionId);

		if (!transaction) {
			throw new ResourceNotFoundError();
		}

		transaction.title = title ? title : transaction.title;
		transaction.amount = amount
			? new Decimal(type === "credit" ? amount : amount * -1)
			: transaction.amount;
		transaction.accomplishment = accomplishment
			? accomplishment
			: transaction.accomplishment;

		return { transaction };
	}
}
