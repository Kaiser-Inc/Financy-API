import { makeCreateTransactionUseCase } from "@/services/factories/make-create-transaction";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createTransaction(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const createTransactionBodySchema = z.object({
		title: z.string(),
		amount: z.number(),
		type: z.enum(["credit", "debit"]),
	});

	const { amount, title, type } = createTransactionBodySchema.parse(
		request.body,
	);

	try {
		const createTransactionUseCase = makeCreateTransactionUseCase();

		const { transaction } = await createTransactionUseCase.execute({
			amount,
			title,
			type,
			userId: request.user.sub,
		});
		return reply.status(201).send(transaction);
	} catch (err) {
		return reply.status(500).send();
	}
}
