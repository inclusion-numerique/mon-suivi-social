import { removeNullUndefinedAndEmptyValues } from '@mss/web/utils/removeNullUndefinedAndEmptyValues'

describe('removeNullUndefinedAndEmptyStringValues', () => {
  it('Removes null, undefined, and empty string values', () => {
    expect(
      removeNullUndefinedAndEmptyValues({
        a: '',
        b: 0,
        c: {},
        d: [],
        e: null,
        f: undefined,
        g: NaN,
      }),
    ).toEqual({ b: 0, c: {}, d: [], g: NaN })
  })
})
