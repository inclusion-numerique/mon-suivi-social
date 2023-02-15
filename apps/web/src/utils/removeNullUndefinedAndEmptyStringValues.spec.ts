import { removeNullUndefinedAndEmptyStringValues } from '@mss/web/utils/removeNullUndefinedAndEmptyStringValues'

describe('removeNullUndefinedAndEmptyStringValues', () => {
  it('Removes null, undefined, and empty string values', () => {
    expect(
      removeNullUndefinedAndEmptyStringValues({
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
