import { describe, beforeEach, it, expect } from "vitest";
import { DeleteTransactionUseCase } from "./delete-transaction";
import { InMemoryTransactionsRepository } from "@/repositories/in-memory/in-memory-transactions-repository";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@/lib/client/runtime/library";

describe("Delete Transaction Use Case", () => {
	let transactionsRepository: InMemoryTransactionsRepository;
	let sut: DeleteTransactionUseCase;

	beforeEach(() => {
		transactionsRepository = new InMemoryTransactionsRepository();
		sut = new DeleteTransactionUseCase(transactionsRepository);
	});

	it("should be able to delete a transaction", async () => {
		const createdTransaction = await transactionsRepository.create({
			id: "test-1",
			amount: new Decimal(1000),
			title: "Salário",
			userId: "user-1",
			accomplishment: new Date(),
		});

		await sut.execute({
			transactionId: createdTransaction.id,
		});

		expect(transactionsRepository.items).toHaveLength(0);
	});
});
