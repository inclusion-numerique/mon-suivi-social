import { formatDate } from '@mss/web/utils/formatDate'

describe('formatDate', () => {
  it('formats date', () => {
    expect(formatDate(new Date('2023-02-16T07:48:58'))).toEqual('16/02/2023')
  })
})
