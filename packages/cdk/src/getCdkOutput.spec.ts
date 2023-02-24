import { normalizeCdkOutputKey } from './getCdkOutput'

describe('getCdkOutput', () => {
  describe('normalizeCdkOutputKey', () => {
    it('Normalizes suffixed outputs', () => {
      expect(
        normalizeCdkOutputKey('web_outputuploadsBucketName_14BB6D15'),
      ).toEqual('uploadsBucketName')
    })
    it('Normalizes non-suffixed outputs', () => {
      expect(normalizeCdkOutputKey('output_uploadsBucketName')).toEqual(
        'uploadsBucketName',
      )
    })
  })
})
