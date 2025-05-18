import type { FastifyInstance } from "fastify";
import { createTransaction } from "../controllers/create-transaction";
import { verifyJWT } from "../middlewares/authenticate";
import { fetchTransactions } from "../controllers/fetch-transactions";
import { getTransaction } from "../controllers/get-transaction";
import { getSummary } from "../controllers/get-summary";
import { deleteTransaction } from "../controllers/delete-transaction";
import { updateTransaction } from "../controllers/update-transaction";

export async function appRoutes(app: FastifyInstance) {
	app.addHook("onRequest", verifyJWT);

	app.post("/transactions", createTransaction);
	app.get("/transactions", fetchTransactions);

	app.get("/summary", getSummary);

	app.get("/transactions/:transactionId", getTransaction);
	app.delete("/transactions/:transactionId", deleteTransaction);
	app.put("/transactions/:transactionId", updateTransaction);
}
