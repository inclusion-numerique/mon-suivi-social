import { removeNullValues } from '@mss/web/utils/removeNullValues'

describe('removeNullValues', () => {
  it('Removes null values', () => {
    expect(
      removeNullValues({
        a: '',
        b: 0,
        c: {},
        d: [],
        e: null,
        f: undefined,
        g: NaN,
      }),
    ).toEqual({ a: '', b: 0, c: {}, d: [], f: undefined, g: NaN })
  })
})
