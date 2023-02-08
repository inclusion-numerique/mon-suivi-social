import { CSSProperties, ReactNode } from 'react'

// Representation of an object attribute
// Array of [label: string, content: ReactNode|string, options: {...}]
export type AttributeItem =
  | [string, ReactNode]
  | [string, ReactNode, AttributeItemOptions]
export type AttributeItemOptions = {
  inline?: boolean
  verticalAlign?: CSSProperties['alignItems']
}

export const AttributesList = ({
  items,
}: {
  items: (AttributeItem | undefined)[]
}) => {
  return (
    <ul className="fr-raw-list">
      {items
        .filter((item): item is AttributeItem => !!item)
        .map((item) => (
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
  const valueNode =
    value === undefined || value === null ? (
      // Manual adjustment of hint text vertical alignment to match label baseline
      <p className="fr-hint-text fr-mb-0" style={{ marginTop: '0.20rem' }}>
        Non renseigné
      </p>
    ) : isScalar(value) ? (
      <strong>{value}</strong>
    ) : (
      value
    )

  return (
    <li
      className="fr-mt-2v"
      style={{
        display: 'flex',
        alignItems: options?.verticalAlign,
        flexDirection: options?.inline === false ? 'column' : 'row',
      }}
    >
      {label}
      {separator}
      {valueNode}
    </li>
  )
}
