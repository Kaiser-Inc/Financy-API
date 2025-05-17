import { makeCreateTransactionUseCase } from "@/services/factories/make-create-transaction";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createTransactionBodySchema = z.object({
		title: z.string(),
		amount: z.number(),
		type: z.enum(["credit", "debit"]),
	});

	const { amount, title, type } = createTransactionBodySchema.parse(
		request.body,
	);

	try {
		const registerUseCase = makeCreateTransactionUseCase();

		await registerUseCase.execute({
			amount,
			title,
			type,
			userId: request.user.sub,
		});
	} catch (err) {
		return reply.status(500).send();
	}

	return reply.status(201).send;
}
