import styles from '@mss/web/app/(private)/beneficiaires/(list)/TableRow.module.css'
import { TableColumnDefinition } from '@mss/web/ui/table/TableColumnDefinition'
import Link from 'next/link'

export function TableRow<Item extends Record<string, unknown>>({
  item,
  columns,
}: {
  item: Item
  columns: TableColumnDefinition<Item>[]
}) {
  return (
    <tr className={styles.row}>
      {columns.map(({ content, label }, index) => (
        <td key={label}>{content(item)}</td>
      ))}
    </tr>
  )
}
