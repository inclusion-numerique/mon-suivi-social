import { FunctionComponent, PropsWithChildren } from 'react'

export type FunctionComponentWithChildren<P = unknown> = FunctionComponent<
  PropsWithChildren<P>
>
