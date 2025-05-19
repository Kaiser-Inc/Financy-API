import { Decimal } from '@/lib/client/runtime/library'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import ExcelJS from 'exceljs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ExportTransactionsUseCase } from './export-transactions'

describe('Export Transactions Use Case', () => {
  let transactionsRepository: InMemoryTransactionsRepository
  let sut: ExportTransactionsUseCase

  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new ExportTransactionsUseCase(transactionsRepository)
  })

  it('should be able to export transactions to excel with total summary', async () => {
    // Arrange
    const userId = 'user-1'
    const transaction1 = {
      id: 'transaction-1',
      title: 'Salário',
      amount: new Decimal(5000),
      accomplishment: new Date('2024-03-20'),
      category: 'geral',
      userId,
    }
    const transaction2 = {
      id: 'transaction-2',
      title: 'Aluguel',
      amount: new Decimal(-1500),
      accomplishment: new Date('2024-03-21'),
      category: 'geral',
      userId,
    }

    await transactionsRepository.create(transaction1)
    await transactionsRepository.create(transaction2)

    // Act
    const { buffer, filename } = await sut.execute({ userId })

    // Assert
    expect(Buffer.isBuffer(buffer)).toBe(true)
    expect(filename).toContain(userId)
    expect(filename).toContain('transactions.xlsx')

    // Verifica o conteúdo do Excel
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)
    const worksheet = workbook.getWorksheet('Transações')

    if (!worksheet) {
      throw new Error('Worksheet não encontrada')
    }

    // Verifica se existem 3 linhas (cabeçalho + 2 transações + 1 resumo)
    expect(worksheet.rowCount).toBe(4)

    // Verifica o valor total
    const totalRow = worksheet.getRow(4)
    expect(totalRow.getCell(2).value).toBe('TOTAL') // Coluna B (title)
    expect(totalRow.getCell(3).value).toBe(3500) // Coluna C (amount)
  })

  it('should return empty excel with zero total when user has no transactions', async () => {
    // Arrange
    const userId = 'user-without-transactions'

    // Act
    const { buffer, filename } = await sut.execute({ userId })

    // Assert
    expect(Buffer.isBuffer(buffer)).toBe(true)
    expect(filename).toContain(userId)
    expect(filename).toContain('transactions.xlsx')

    // Verifica o conteúdo do Excel
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)
    const worksheet = workbook.getWorksheet('Transações')

    if (!worksheet) {
      throw new Error('Worksheet não encontrada')
    }

    // Verifica se existem 2 linhas (cabeçalho + 1 resumo)
    expect(worksheet.rowCount).toBe(2)

    // Verifica o valor total
    const totalRow = worksheet.getRow(2)
    expect(totalRow.getCell(2).value).toBe('TOTAL') // Coluna B (title)
    expect(totalRow.getCell(3).value).toBe(0) // Coluna C (amount)
  })
})
