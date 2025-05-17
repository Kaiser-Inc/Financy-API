import { auth } from "@/lib/axios/auth";
import type { FastifyRequest, FastifyReply } from "fastify";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
	const token = request.headers.authorization;

	if (!token) {
		return reply.status(401).send({ error: "token missing." });
	}

	try {
		const response = await auth.post(
			"/token/verify",
			{},
			{
				headers: {
					Authorization: token,
				},
			},
		);
		request.user = response.data.user;
	} catch (error) {
		return reply.status(401).send({ error: "Invalid token." });
	}
}
