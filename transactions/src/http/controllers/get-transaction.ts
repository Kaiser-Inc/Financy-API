import { makeGetTransactionUseCase } from "@/services/factories/make-get-transactions";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getTransaction(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const transactionParamsSchema = z.object({
		transactionId: z.string().uuid(),
	});

	const { transactionId } = transactionParamsSchema.parse(request.params);

	try {
		const getTransactionUseCase = makeGetTransactionUseCase();

		const { transaction } = await getTransactionUseCase.execute({
			transactionId,
		});

		return reply.status(200).send({ transaction });
	} catch (err) {
		return reply.status(500).send();
	}
}
