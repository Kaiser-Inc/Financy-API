import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository";
import { ExportTransactionsUseCase } from "../export-transactions";

export function makeExportTransactionsUseCase() {
	const transactionsRepository = new PrismaTransactionsRepository();
	const useCase = new ExportTransactionsUseCase(transactionsRepository);

	return useCase;
}
