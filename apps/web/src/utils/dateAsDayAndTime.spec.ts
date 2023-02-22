import { dateAsDayAndTime } from '@mss/web/utils/dateAsDayAndTime'

describe('dateAsDayAndTime', () => {
  it('formats date', () => {
    expect(dateAsDayAndTime(new Date('2023-02-16T07:48:58'))).toEqual(
      '16/02/2023 07h48',
    )
  })
})
