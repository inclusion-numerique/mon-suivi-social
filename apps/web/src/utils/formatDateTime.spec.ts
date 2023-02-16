import { formatDateTime } from '@mss/web/utils/formatDateTime'

describe('formatDateTime', () => {
  it('formats date', () => {
    expect(formatDateTime(new Date('2023-02-16T07:48:58'))).toEqual(
      '16/02/2023 07h48',
    )
  })
})
