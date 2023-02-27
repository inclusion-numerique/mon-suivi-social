import 'jest'
import { matchers as joiMatchers } from 'jest-joi'
import 'jest-extended'
import 'jest-extended/all'
import '@testing-library/jest-dom/extend-expect'
import { TextEncoder, TextDecoder } from 'util'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env') })

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as never

expect.extend(joiMatchers)
