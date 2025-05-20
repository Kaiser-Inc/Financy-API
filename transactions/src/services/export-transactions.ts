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
      { header: 'ID', key: 'id', width: 40 },
      { header: 'Titulo', key: 'title', width: 35 },
      { header: 'Valor', key: 'amount', width: 15 },
      { header: 'Data', key: 'accomplishment', width: 25 },
      { header: 'Categoria', key: 'category', width: 25 },
    ]

    for (const transaction of transactions) {
      const row = worksheet.addRow({
        id: transaction.id,
        title: transaction.title,
        amount: Number(transaction.amount),
        accomplishment: transaction.accomplishment,
        category: transaction.category,
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

    const totalAmount = transactions.reduce(
      (acc, transaction) => acc + Number(transaction.amount),
      0,
    )
    const summaryRow = worksheet.addRow({
      id: '',
      title: 'TOTAL',
      amount: totalAmount,
      accomplishment: '',
      category: '',
    })

    const totalCell = summaryRow.getCell('amount')
    totalCell.numFmt = '#,##0.00'
    totalCell.font = { bold: true }

    if (totalAmount >= 0) {
      totalCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'c6efce' },
      }
      totalCell.font = { ...totalCell.font, color: { argb: '006100' } }
    } else {
      totalCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffc7ce' },
      }
      totalCell.font = { ...totalCell.font, color: { argb: '9c0006' } }
    }

    const buffer = await workbook.xlsx.writeBuffer()

    return {
      buffer,
      filename: `${userId}-${Date.now()}-transactions.xlsx`,
    }
  }
}
