import { euros } from '@mss/web/utils/euros'
import { Prisma } from '@prisma/client'

describe('euros', () => {
  test('parses a number without digit to a 2-digit number as a string', () => {
    expect(euros(new Prisma.Decimal(2))).toBe('2,00 €')
  })
  test('parses a number with 1 digit to a 2-digit number as a string', () => {
    expect(euros(new Prisma.Decimal(2.1))).toBe('2,10 €')
  })
  test('parses a number with 2 digit to a 2-digit number as a string', () => {
    expect(euros(new Prisma.Decimal(2.12))).toBe('2,12 €')
  })
  test('parses a number with more than 2 digit to a 2-digit number as a string', () => {
    expect(euros(new Prisma.Decimal(2.123_45))).toBe('2,12 €')
  })
})
