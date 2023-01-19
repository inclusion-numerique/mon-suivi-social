import { createReadStream, createWriteStream } from 'fs'
import { resolve } from 'path'
import { get, request } from 'https'
import { parse } from 'csv-parse'
import { IncomingHttpHeaders } from 'http'

export const downloadFile = (
  url: string,
  destinationDirectory: string,
  filename: string,
): Promise<void> => {
  const file = createWriteStream(resolve(destinationDirectory, filename))
  return new Promise((res, rej) => {
    const request = get(url, function (response) {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        res()
      })
      file.on('error', (error) => {
        rej(error)
      })
      request.on('error', (error) => {
        rej(error)
      })
    })
  })
}

export const getHeaders = (url: string) =>
  new Promise<{
    statusCode?: string
    statusMessage?: string
    headers: IncomingHttpHeaders
  }>((res, rej) => {
    request(
      url,
      {
        method: 'HEAD',
      },
      (response) => {
        res({
          statusCode: response.statusMessage,
          statusMessage: response.statusMessage,
          headers: response.headers,
        })
      },
    )
      .on('error', rej)
      .end()
  })

export type Output = (message: string) => void

export const consoleOutput: Output = (message) => {
  console.log(`Data: ${message}`)
}

export const getDataRows = <T extends unknown[] = string[]>(
  file: string,
  delimiter = ',',
): Promise<T[]> => {
  return new Promise((res, rej) => {
    const records: string[][] = []

    const readStream = createReadStream(file)

    const parser = parse({
      delimiter,
    })

    parser.on('readable', () => {
      let record
      while ((record = parser.read()) !== null) {
        records.push(record)
      }
    })

    parser.on('error', rej)
    // Test that the parsed records matched the expected records
    parser.on('end', function () {
      res(records as T[])
    })
    readStream.pipe(parser)
  })
}
