import type { FastifyRequest, FastifyReply } from "fastify";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
	try {
		const decoded = await request.jwtVerify();
		return reply.send({ user: decoded });
	} catch (err) {
		return reply.status(401).send({ message: "Unauthorized" });
	}
}
