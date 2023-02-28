import { customAlphabet } from 'nanoid'

const generator = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZ', 10)

export const generateFileNumber = () => generator()
