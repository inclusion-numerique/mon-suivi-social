import { ReactNode } from 'react'
import styles from './AttributesList.module.css'

// Representation of an object attribute
// Array of [label: string, content: ReactNode|string]
export type AttributeItem = [string, ReactNode]

export function AttributesList({
  items,
}: {
  items: (AttributeItem | undefined)[]
}) {
  return (
    <ul className={`fr-raw-list ${styles['attributes-list']}`}>
      {items
        // Remove empty attributes and attributes with empty value
        .filter((item): item is AttributeItem => {
          if (!item) return false
          const [_, node] = item
          return !!node && (typeof node !== 'string' || !!node.trim())
        })
        .map((item) => (
          <AttributesListItem key={item[0]} item={item} />
        ))}
    </ul>
  )
}

export function AttributesListItem({
  item: [label, value],
}: {
  item: AttributeItem
}) {
  const missingValue = value === null || value === undefined
  const valueNode = value ?? '(non renseigné)'

  return (
    <li className={styles['attributes-list-item']}>
      <p className="fr-mb-0">{label}</p>
      <p className={`fr-mb-0 ${missingValue ? styles['missing-value'] : ''}`}>
        {valueNode}
      </p>
    </li>
  )
}
