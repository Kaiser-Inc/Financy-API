import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function transactionRoutes(app: FastifyInstance) {
    app.get('/', async (request, reply) => {
        const sessionId = request.cookies
        const transactions = await prisma.transaction.findMany({
            where: sessionId,
        })

        return {
            transactions
        }
    })

    app.get('/:id', async (request, reply) => {
        const getSpecificTransactionParamsSchema = z.object({
            id: z.string()
        })

        const { id } = getSpecificTransactionParamsSchema.parse(request.params)
        const { sessionId } = request.cookies

        const transaction = await prisma.transaction.findUnique({
            where: {
                id,
                sessionId
            }
        })

        return {
            transaction
        }
    })

    app.get('/summary', async (request, reply) => {
        const { sessionId } = request.cookies

        const transactionsSummary = await prisma.transaction.aggregate({
            _sum: {
                amount: true
            },
            where: {
                sessionId
            }
        })

        return {
            summary: transactionsSummary._sum.amount
        }
    })

    app.post('/', async (request, reply) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId
        const sevenDaysInSeconds = 60 * 60 * 24 * 7

        if (!sessionId) {
            sessionId = randomUUID()

            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: sevenDaysInSeconds
            })
        }

        await prisma.transaction.create({
            data: {
                id: randomUUID(),
                title,
                amount: type === 'credit' ? amount : amount * -1,
                sessionId

            }
        })

        reply.status(201).send()
    })
}