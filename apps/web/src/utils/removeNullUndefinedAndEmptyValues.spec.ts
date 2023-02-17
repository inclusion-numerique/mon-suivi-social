import { removeNullUndefinedAndEmptyValues } from '@mss/web/utils/removeNullUndefinedAndEmptyValues'

describe('removeNullUndefinedAndEmptyStringValues', () => {
  it('Removes null, undefined, and empty string values', () => {
    expect(
      removeNullUndefinedAndEmptyValues({
        a: '',
        a1: '    ',
        a2: '  \n',
        a3: '0',
        b: 0,
        c: {},
        c1: { hello: null },
        d: [],
        d1: [0],
        d2: [null],
        d3: [undefined],
        e: null,
        f: undefined,
        g: NaN,
      }),
    ).toEqual({
      a3: '0',
      b: 0,
      c1: { hello: null },
      d1: [0],
      d2: [null],
      d3: [undefined],
      g: NaN,
    })
  })
})
