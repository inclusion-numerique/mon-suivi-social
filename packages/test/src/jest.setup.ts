import 'jest'
import { matchers as joiMatchers } from 'jest-joi'
import 'jest-extended'
import 'jest-extended/all'
import '@testing-library/jest-dom/extend-expect'
import { TextEncoder, TextDecoder } from 'node:util'
import * as dotenv from 'dotenv'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env'),
})

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as never

expect.extend(joiMatchers)
