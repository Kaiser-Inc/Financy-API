import type { TransactionsRepository } from "@/repositories/transactions-repository";
import type { Transaction } from "@/lib/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface getTransactionUseCaseRequest {
	transactionId: string;
}

interface getTransactionUseCaseResponse {
	transaction: Transaction;
}

export class getTransactionUseCase {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({
		transactionId,
	}: getTransactionUseCaseRequest): Promise<getTransactionUseCaseResponse> {
		const transaction =
			await this.transactionsRepository.findById(transactionId);

		if (!transaction) {
			throw new ResourceNotFoundError();
		}

		return { transaction };
	}
}
