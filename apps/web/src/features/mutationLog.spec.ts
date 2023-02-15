import { computeMutationDiff } from '@mss/web/features/mutationLog'

describe('mutationLog', () => {
  describe('computeMutationDiff', () => {
    it('Computes diff for empty initial object', () => {
      const diff = computeMutationDiff({}, { a: true, b: null, c: 'c' })
      expect(diff).toEqual({
        added: {
          a: true,
          c: 'c',
        },
        updated: {},
        deleted: {},
      })
    })

    it('Computes diff with initial object', () => {
      const diff = computeMutationDiff(
        { a: null, b: 3, c: 'c', d: 'd', e: 'e', g: undefined },
        { a: true, b: null, c: 'c', e: 12, f: 'f', g: 4 },
      )
      expect(diff).toEqual({
        added: {
          a: true,
          f: 'f',
          g: 4,
        },
        updated: {
          e: 12,
        },
        deleted: {
          b: 3,
          d: 'd',
        },
      })
    })
  })
})
