import { dateAsDay } from '@mss/web/utils/dateAsDay'

describe('dateAsDay', () => {
  it('formats date', () => {
    expect(dateAsDay(new Date('2023-02-16T07:48:58'))).toEqual('16/02/2023')
  })
})
