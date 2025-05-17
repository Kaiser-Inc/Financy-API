import type { TransactionsRepository } from "@/repositories/transactions-repository";
import type { Decimal } from "@/lib/client/runtime/library";

interface GetSummaryUseCaseRequest {
	userId: string;
}

interface GetSummaryUseCaseResponse {
	summary: Decimal | null;
}

export class GetSummaryUseCase {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({
		userId,
	}: GetSummaryUseCaseRequest): Promise<GetSummaryUseCaseResponse> {
		const summary =
			await this.transactionsRepository.getSummaryByUserId(userId);

		return { summary };
	}
}
