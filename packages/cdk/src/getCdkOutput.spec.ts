import { normalizeCdkOutputKey } from './getCdkOutput'

describe('getCdkOutput', () => {
  describe('normalizeCdkOutputKey', () => {
    it('Normalizes outputs', () => {
      expect(normalizeCdkOutputKey('output_uploadsBucketName')).toEqual(
        'uploadsBucketName',
      )
    })
  })
})
