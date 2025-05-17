import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryTransactionsRepository } from "@/repositories/in-memory/in-memory-transactions-repository";
import { getTransactionUseCase } from "./get-transaction";
import { Decimal } from "@/lib/client/runtime/library";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

describe("Get Transaction Use Case", () => {
	let transactionsRepository: InMemoryTransactionsRepository;
	let sut: getTransactionUseCase;

	beforeEach(() => {
		transactionsRepository = new InMemoryTransactionsRepository();
		sut = new getTransactionUseCase(transactionsRepository);
	});

	it("should be able to get a transaction by id", async () => {
		const createdTransaction = await transactionsRepository.create({
			id: "test-1",
			amount: new Decimal(1000),
			title: "test transaction",
			userId: "user-1",
		});

		const { transaction } = await sut.execute({
			transactionId: createdTransaction.id,
		});

		expect(transaction).toEqual(
			expect.objectContaining({
				id: "test-1",
				amount: new Decimal(1000),
				title: "test transaction",
				userId: "user-1",
			}),
		);
	});

	it("should throw ResourceNotFoundError when transaction does not exist", async () => {
		await expect(
			sut.execute({
				transactionId: "non-existent-id",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
