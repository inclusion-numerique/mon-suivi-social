import 'jest'
import { matchers as joiMatchers } from 'jest-joi'
import 'jest-extended'
import 'jest-extended/all'
import '@testing-library/jest-dom/extend-expect'
import { TextDecoder, TextEncoder } from 'node:util'
import * as dotenv from 'dotenv'
import { resolve } from 'node:path'

dotenv.config({
  // eslint-disable-next-line unicorn/prefer-module
  path: resolve(__dirname, '../.env'),
})

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as never

expect.extend(joiMatchers)
