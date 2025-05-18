import type { TransactionsRepository } from '@/repositories/transactions-repository'
import ExcelJS from 'exceljs'

interface ExportTransactionsUseCaseRequest {
  userId: string
}

interface ExportTransactionsUseCaseResponse {
  buffer: ArrayBuffer
  filename: string
}

export class ExportTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    userId,
  }: ExportTransactionsUseCaseRequest): Promise<ExportTransactionsUseCaseResponse> {
    const transactions = await this.transactionsRepository.findManyByUserId(
      userId,
      0,
    )

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Transações')

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Titulo', key: 'title', width: 30 },
      { header: 'Valor', key: 'amount', width: 15 },
      { header: 'Data', key: 'accomplishment', width: 25 },
    ]

    for (const transaction of transactions) {
      const row = worksheet.addRow({
        id: transaction.id,
        title: transaction.title,
        amount: Number(transaction.amount),
        accomplishment: transaction.accomplishment,
      })

      const amountCell = row.getCell('amount')
      amountCell.numFmt = '#,##0.00'

      if (Number(transaction.amount) >= 0) {
        amountCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'C6EFCE' },
        }
        amountCell.font = { color: { argb: '006100' } }
      } else {
        amountCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFC7CE' },
        }
        amountCell.font = { color: { argb: '9C0006' } }
      }
    }

    const buffer = await workbook.xlsx.writeBuffer()

    return {
      buffer,
      filename: `${userId}-${Date.now()}-transactions.xlsx`,
    }
  }
}
