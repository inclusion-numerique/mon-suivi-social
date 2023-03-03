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

export function AttributesList({
  items,
}: {
  items: (AttributeItem | undefined)[]
}) {
  return (
    <ul className="fr-raw-list">
      {items
        .filter((item): item is AttributeItem => !!item)
        // Remove empty attributes
        .filter(([_, node]) => {
          // remove null, undefined and empty strings
          if (!node) {
            return false
          }
          if (typeof node === 'string' && node.trim() === '') {
            return false
          }
          return true
        })
        .map((item) => (
          <AttributesListItem key={item[0]} item={item} />
        ))}
    </ul>
  )
}

const isScalar = (value: ReactNode) =>
  typeof value === 'string' || typeof value === 'number'

const separator = <>&nbsp;:&nbsp;</>

function AttributesListItem({
  item: [label, value, options],
}: {
  item: AttributeItem
}) {
  const valueNode =
    value === undefined || value === null ? (
      <p className="fr-mb-0" style={{ color: 'var(--text-mention-grey)' }}>
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
