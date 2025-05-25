import type { FastifyInstance } from 'fastify'
import { createTransaction } from '../controllers/create-transaction'
import { deleteTransaction } from '../controllers/delete-transaction'
import { exportTransactions } from '../controllers/export-transactions'
import { fetchTransactions } from '../controllers/fetch-transactions'
import { getSummary } from '../controllers/get-summary'
import { getSummaryOnDateRange } from '../controllers/get-summary-on-date-range'
import { getTransaction } from '../controllers/get-transaction'
import { searchTransactions } from '../controllers/seacth-transactions'
import { updateTransaction } from '../controllers/update-transaction'
import { verifyJWT } from '../middlewares/authenticate'

export async function appRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/transactions', createTransaction)
  app.get('/transactions', fetchTransactions)
  app.get('/transactions/search', searchTransactions)

  app.get('/summary', getSummary)
  app.get('/summary/period', getSummaryOnDateRange)
  app.get('/export', exportTransactions)

  app.get('/transactions/:transactionId', getTransaction)
  app.delete('/transactions/:transactionId', deleteTransaction)
  app.put('/transactions/:transactionId', updateTransaction)
}
