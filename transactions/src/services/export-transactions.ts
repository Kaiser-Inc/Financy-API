import ExcelJS from "exceljs";
import { Prisma, type Transaction } from "@/lib/client";
import type { TransactionsRepository } from "@/repositories/transactions-repository";

interface ExportTransactionsUseCaseRequest {
	userId: string;
}

interface ExportTransactionsUseCaseResponse {
	buffer: ArrayBuffer;
	filename: string;
}

export class ExportTransactionsUseCase {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({
		userId,
	}: ExportTransactionsUseCaseRequest): Promise<ExportTransactionsUseCaseResponse> {
		const transactions = await this.transactionsRepository.findManyByUserId(
			userId,
			0,
		);

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Transações");

		worksheet.columns = [
			{ header: "ID", key: "id", width: 36 },
			{ header: "Titulo", key: "title", width: 30 },
			{ header: "Valor", key: "amount", width: 15 },
			{ header: "Data", key: "accomplishment", width: 25 },
		];

		for (const transaction of transactions) {
			worksheet.addRow({
				id: transaction.id,
				title: transaction.title,
				amount: transaction.amount,
				accomplishment: transaction.accomplishment,
			});
		}

		const buffer = await workbook.xlsx.writeBuffer();

		return {
			buffer,
			filename: `${userId}-${Date.now()}-transactions.xlsx`,
		};
	}
}
