import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryTransactionsRepository } from "@/repositories/in-memory/in-memory-transactions-repository";
import { FetchTransactionsUseCase } from "./fetch-transactions";
import { Decimal } from "@/lib/client/runtime/library";

describe("Fetch Transaction Use Case", () => {
	let transactionsRepository: InMemoryTransactionsRepository;
	let sut: FetchTransactionsUseCase;

	beforeEach(() => {
		transactionsRepository = new InMemoryTransactionsRepository();
		sut = new FetchTransactionsUseCase(transactionsRepository);
	});

	it("should be able to fetch transactions", async () => {
		transactionsRepository.create({
			id: "test-1",
			amount: new Decimal(1000),
			title: "test transaction 1",
			userId: "Kaiser",
		});

		transactionsRepository.create({
			id: "test-2",
			amount: new Decimal(2000),
			title: "test transaction 2",
			userId: "Kaiser",
		});

		const { transactions } = await sut.execute({
			userId: "Kaiser",
			page: 1,
		});

		expect(transactions).toHaveLength(2);
		expect(transactions[0].title).toBe("test transaction 1");
		expect(transactions[1].title).toBe("test transaction 2");
	});

	it("should return empty array when user has no transactions", async () => {
		const { transactions } = await sut.execute({
			userId: "non-existent-user",
			page: 1,
		});

		expect(transactions).toHaveLength(0);
	});

	it("should only fetch transactions from the specified user", async () => {
		// Criar transação para o usuário Kaiser
		transactionsRepository.create({
			id: "test-1",
			amount: new Decimal(1000),
			title: "Kaiser's transaction",
			userId: "Kaiser",
		});

		// Criar transação para outro usuário
		transactionsRepository.create({
			id: "test-2",
			amount: new Decimal(2000),
			title: "Other user's transaction",
			userId: "OtherUser",
		});

		const { transactions } = await sut.execute({
			userId: "Kaiser",
			page: 1,
		});

		expect(transactions).toHaveLength(1);
		expect(transactions[0].userId).toBe("Kaiser");
		expect(transactions[0].title).toBe("Kaiser's transaction");
	});

	it("should handle pagination correctly", async () => {
		// Criar múltiplas transações
		for (let i = 1; i <= 25; i++) {
			transactionsRepository.create({
				id: `test-${i}`,
				amount: new Decimal(1000 * i),
				title: `Transaction ${i}`,
				userId: "Kaiser",
			});
		}

		// Buscar primeira página
		const page1 = await sut.execute({
			userId: "Kaiser",
			page: 1,
		});

		// Buscar segunda página
		const page2 = await sut.execute({
			userId: "Kaiser",
			page: 2,
		});

		expect(page1.transactions).toHaveLength(20); // Assumindo 10 itens por página
		expect(page2.transactions).toHaveLength(5);
		expect(page1.transactions[0].title).toBe("Transaction 1");
		expect(page2.transactions[0].title).toBe("Transaction 21");
	});
});
