import { ReactNode } from 'react'

// Representation of an object attribute
// Array of [label: string, content: ReactNode|string, options: {...}]
export type AttributeItem =
  | [string, ReactNode]
  | [string, ReactNode, AttributeItemOptions]
export type AttributeItemOptions = { inline?: boolean }

export const AttributesList = ({ items }: { items: AttributeItem[] }) => {
  return (
    <ul className="fr-raw-list">
      {items.map((item) => (
        <AttributesListItem key={item[0]} item={item} />
      ))}
    </ul>
  )
}

const isScalar = (value: ReactNode) =>
  typeof value === 'string' || typeof value === 'number'

const separator = <>&nbsp;:&nbsp;</>

const AttributesListItem = ({
  item: [label, value, options],
}: {
  item: AttributeItem
}) => {
  const valueNode = isScalar(value) ? <strong>{value}</strong> : value

  return (
    <li
      className="fr-mt-2v"
      style={{
        display: 'flex',
        flexDirection: options?.inline === false ? 'column' : 'row',
      }}
    >
      {label}
      {separator}
      {valueNode}
    </li>
  )
}
