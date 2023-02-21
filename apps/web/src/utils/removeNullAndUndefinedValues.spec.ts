import { removeNullAndUndefinedValues } from '@mss/web/utils/removeNullAndUndefinedValues'

describe('removeNullAndUndefinedValues', () => {
  it('Removes null and values', () => {
    expect(
      removeNullAndUndefinedValues({
        a: '',
        b: 0,
        c: {},
        d: [],
        e: null,
        f: undefined,
        g: NaN,
      }),
    ).toEqual({ a: '', b: 0, c: {}, d: [], g: NaN })
  })
})
