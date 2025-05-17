import type { FastifyInstance } from "fastify";
import { createTransaction } from "../controllers/create-transaction";
import { verifyJWT } from "../middlewares/authenticate";
import { fetchTransactions } from "../controllers/fetch-transactions";
import { getTransaction } from "../controllers/get-transaction";
import { getSummary } from "../controllers/get-summary";

export async function appRoutes(app: FastifyInstance) {
	app.addHook("onRequest", verifyJWT);

	app.post("/transactions", createTransaction);

	app.get("/transactions", fetchTransactions);
	app.get("/transactions/:transactionId", getTransaction);
	app.get("/summary", getSummary);
}
