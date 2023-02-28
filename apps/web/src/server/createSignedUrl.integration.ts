describe.skip('createSignedUrl', () => {
  it('requires fixing', () => {})
  //   describe.skip('createSignedGetUrl', () => {
  //     it('can createSignedUrl', async () => {
  //       const key = 'test/small-test-image.png'
  //
  //       const { url } = await createSignedGetUrl({
  //         key,
  //       })
  //
  //       expect(url).toBeString()
  //       expect(url).toStartWith('https://')
  //       expect(url).toInclude('test/small-test-image.png')
  //       expect(url).toInclude(PrivateConfig.S3.bucketId)
  //       expect(url).toInclude(key)
  //
  //       // Try with system lib, should always work if url is correct
  //       const { status } = await axios.get(url)
  //       expect(status).toEqual(200)
  //     }, 30000)
  //   })
  //
  //   describe.skip('createSignedUploadUrl', () => {
  //     it('canCreateSignedUrl', async () => {
  //       const fileName = '2022-11-test.png'
  //       const type = 'image/png'
  //       const filePath = resolve(
  //   __dirname, '../../test/small-test-image.png')
  //
  //       const { url, key } = await createSignedUploadUrl({
  //         directory: `test/${new Date().getTime()}`,
  //         name: fileName,
  //         type,
  //       })
  //
  //       expect(key).toBeString()
  //       expect(key).toInclude(fileName)
  //       expect(url).toBeString()
  //       expect(url).toStartWith('https://')
  //       expect(url).toInclude(PrivateConfig.S3.bucketId)
  //       expect(url).toInclude(fileName)
  //
  //       const { status } = await axios.put(url, {
  //         data: createReadStream(filePath),
  //       })
  //       expect(status).toEqual(200)
  //     }, 30000)
  //   })
})
export {}
