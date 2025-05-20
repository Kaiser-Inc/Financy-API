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

    const { buffer, filename } = await sut.execute({ userId })

    expect(Buffer.isBuffer(buffer)).toBe(true)
    expect(filename).toContain(userId)
    expect(filename).toContain('transactions.xlsx')

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)
    const worksheet = workbook.getWorksheet('Transações')

    if (!worksheet) {
      throw new Error('Worksheet não encontrada')
    }

    expect(worksheet.rowCount).toBe(4)

    const totalRow = worksheet.getRow(4)
    expect(totalRow.getCell(2).value).toBe('TOTAL') 
    expect(totalRow.getCell(3).value).toBe(3500) 
  })

  it('should return empty excel with zero total when user has no transactions', async () => {
    const userId = 'user-without-transactions'

    const { buffer, filename } = await sut.execute({ userId })

    expect(Buffer.isBuffer(buffer)).toBe(true)
    expect(filename).toContain(userId)
    expect(filename).toContain('transactions.xlsx')

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)
    const worksheet = workbook.getWorksheet('Transações')

    if (!worksheet) {
      throw new Error('Worksheet não encontrada')
    }

    expect(worksheet.rowCount).toBe(2)

    const totalRow = worksheet.getRow(2)
    expect(totalRow.getCell(2).value).toBe('TOTAL')
    expect(totalRow.getCell(3).value).toBe(0)
  })

  it('should be able to export transactions to excel with negative total summary', async () => {
    const userId = 'user-1'
    const transaction1 = {
      id: 'transaction-1',
      title: 'Salário',
      amount: new Decimal(-5000),
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

    const { buffer, filename } = await sut.execute({ userId })

    expect(Buffer.isBuffer(buffer)).toBe(true)
    expect(filename).toContain(userId)
    expect(filename).toContain('transactions.xlsx')

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)
    const worksheet = workbook.getWorksheet('Transações')

    if (!worksheet) {
      throw new Error('Worksheet não encontrada')
    }

    expect(worksheet.rowCount).toBe(4)

    const totalRow = worksheet.getRow(4)
    expect(totalRow.getCell(2).value).toBe('TOTAL') 
    expect(totalRow.getCell(3).value).toBe(-6500) 
  })

})
