import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryTransactionsRepository } from "@/repositories/in-memory/in-memory-transactions-repository";
import { GetSummaryUseCase } from "./get-summary";
import { Decimal } from "@/lib/client/runtime/library";

describe("Get Summary Use Case", () => {
	let transactionsRepository: InMemoryTransactionsRepository;
	let sut: GetSummaryUseCase;

	beforeEach(() => {
		transactionsRepository = new InMemoryTransactionsRepository();
		sut = new GetSummaryUseCase(transactionsRepository);
	});

	it("should be able to get summary with positive balance", async () => {
		// Criar transações de crédito
		await transactionsRepository.create({
			id: "test-1",
			amount: new Decimal(1000),
			title: "Salário",
			userId: "user-1",
			accomplishment: new Date(),
		});

		await transactionsRepository.create({
			id: "test-2",
			amount: new Decimal(500),
			title: "Freelance",
			userId: "user-1",
			accomplishment: new Date(),
		});

		// Criar transação de débito
		await transactionsRepository.create({
			id: "test-3",
			amount: new Decimal(-300),
			title: "Aluguel",
			userId: "user-1",
			accomplishment: new Date(),
		});

		const { summary } = await sut.execute({
			userId: "user-1",
		});

		expect(summary).toEqual(new Decimal(1200)); // 1000 + 500 - 300 = 1200
	});

	it("should be able to get summary with negative balance", async () => {
		// Criar transação de crédito
		await transactionsRepository.create({
			id: "test-1",
			amount: new Decimal(1000),
			title: "Salário",
			userId: "user-1",
			accomplishment: new Date(),
		});

		// Criar transações de débito
		await transactionsRepository.create({
			id: "test-2",
			amount: new Decimal(-800),
			title: "Aluguel",
			userId: "user-1",
			accomplishment: new Date(),
		});

		await transactionsRepository.create({
			id: "test-3",
			amount: new Decimal(-500),
			title: "Contas",
			userId: "user-1",
			accomplishment: new Date(),
		});

		const { summary } = await sut.execute({
			userId: "user-1",
		});

		expect(summary).toEqual(new Decimal(-300)); // 1000 - 800 - 500 = -300
	});

	it("should return zero when user has no transactions", async () => {
		const { summary } = await sut.execute({
			userId: "user-without-transactions",
		});

		expect(summary).toEqual(new Decimal(0));
	});

	it("should only consider transactions from the specified user", async () => {
		// Criar transações para o usuário 1
		await transactionsRepository.create({
			id: "test-1",
			amount: new Decimal(1000),
			title: "Salário User 1",
			userId: "user-1",
			accomplishment: new Date(),
		});

		// Criar transações para o usuário 2
		await transactionsRepository.create({
			id: "test-2",
			amount: new Decimal(2000),
			title: "Salário User 2",
			userId: "user-2",
			accomplishment: new Date(),
		});

		const { summary } = await sut.execute({
			userId: "user-1",
		});

		expect(summary).toEqual(new Decimal(1000)); // Apenas a transação do user-1
	});
});
