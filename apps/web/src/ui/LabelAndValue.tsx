import { PropsWithChildren } from 'react'

// Label and value pair where the Label is the children and value is a prop
export const LabelAndValue = ({
  value,
  children,
}: PropsWithChildren<{
  value: string | null | number | undefined
}>) => {
  if (value === null || value === undefined) {
    return null
  }
  return (
    <li>
      {children}&nbsp;: <strong>{value}</strong>
    </li>
  )
}
