import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository";
import { getTransactionUseCase } from "../get-transaction";

export function makeGetTransactionUseCase() {
	const transactionsRepository = new PrismaTransactionsRepository();
	const useCase = new getTransactionUseCase(transactionsRepository);

	return useCase;
}
