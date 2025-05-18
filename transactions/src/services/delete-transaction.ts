import type { TransactionsRepository } from "@/repositories/transactions-repository";

type DeleteTransactionUseCaseRequest = {
	transactionId: string;
};

export class DeleteTransactionUseCase {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({
		transactionId,
	}: DeleteTransactionUseCaseRequest): Promise<void> {
		await this.transactionsRepository.delete(transactionId);
	}
}
