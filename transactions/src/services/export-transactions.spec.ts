import { describe, it, expect, beforeEach } from "vitest";
import { ExportTransactionsUseCase } from "./export-transactions";
import { InMemoryTransactionsRepository } from "@/repositories/in-memory/in-memory-transactions-repository";
import { Decimal } from "@/lib/client/runtime/library";

describe("Export Transactions Use Case", () => {
	let transactionsRepository: InMemoryTransactionsRepository;
	let sut: ExportTransactionsUseCase;

	beforeEach(() => {
		transactionsRepository = new InMemoryTransactionsRepository();
		sut = new ExportTransactionsUseCase(transactionsRepository);
	});

	it("should be able to export transactions to excel", async () => {
		// Arrange
		const userId = "user-1";
		const transaction1 = {
			id: "transaction-1",
			title: "Salário",
			amount: new Decimal(5000),
			accomplishment: new Date("2024-03-20"),
			userId,
		};
		const transaction2 = {
			id: "transaction-2",
			title: "Aluguel",
			amount: new Decimal(-1500),
			accomplishment: new Date("2024-03-21"),
			userId,
		};

		await transactionsRepository.create(transaction1);
		await transactionsRepository.create(transaction2);

		// Act
		const { buffer, filename } = await sut.execute({ userId });

		// Assert
		expect(Buffer.isBuffer(buffer)).toBe(true);
		expect(filename).toContain(userId);
		expect(filename).toContain("transactions.xlsx");
	});

	it("should return empty excel when user has no transactions", async () => {
		// Arrange
		const userId = "user-without-transactions";

		// Act
		const { buffer, filename } = await sut.execute({ userId });

		// Assert
		expect(Buffer.isBuffer(buffer)).toBe(true);
		expect(filename).toContain(userId);
		expect(filename).toContain("transactions.xlsx");
	});
});
