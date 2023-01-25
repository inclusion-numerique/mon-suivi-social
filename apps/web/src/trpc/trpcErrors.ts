import { TRPCError } from '@trpc/server'

export const forbiddenError = (message?: string) =>
  new TRPCError({
    code: 'FORBIDDEN',
    message: message ?? 'Not authorized.',
  })

export const notfoundError = (message?: string) =>
  new TRPCError({
    code: 'NOT_FOUND',
    message: message ?? 'Not found.',
  })

export const invalidError = (message?: string) =>
  new TRPCError({
    code: 'BAD_REQUEST',
    message: message ?? 'Request is not valid.',
  })
