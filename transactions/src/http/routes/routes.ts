import type { FastifyInstance } from "fastify";
import { create } from "../controllers/create-transaction";
import { verifyJWT } from "../middlewares/authenticate";

export async function appRoutes(app: FastifyInstance) {
	app.addHook("onRequest", verifyJWT);

	app.post("/transactions", create);
}
