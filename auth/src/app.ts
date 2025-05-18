import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { appRoutes } from "./http/routes/routes";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";

export const app = fastify();

app.register(fastifyCookie);

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: "refreshToken",
		signed: false,
	},
	sign: {
		expiresIn: "25m",
	},
});

app.register(fastifyCors, {
	origin: true,
	credentials: true,
});

app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: "Validation error.",
			issues: error.format(),
		});
	}

	if (env.NODE_ENV !== "production") {
		console.error(error);
	}

	return reply.status(500).send({
		message: "Internal server error.",
	});
});
