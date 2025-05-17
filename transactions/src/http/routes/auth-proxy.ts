import fp from "fastify-plugin";
import fastifyHttpProxy from "@fastify/http-proxy";
import { env } from "@/env";

export default fp(async (app) => {
	app.register(fastifyHttpProxy, {
		upstream: env.AUTH_SERVICE_URL,
		prefix: "/auth",
		rewritePrefix: "",
		http2: false,
	});
});
