import styles from './TableRow.module.css'
import { TableColumnDefinition } from '@mss/web/components/Generic/table/TableColumnDefinition'

export function TableRow<Item extends Record<string, unknown>>({
  item,
  columns,
}: {
  item: Item
  columns: TableColumnDefinition<Item>[]
}) {
  return (
    <tr className={styles.row}>
      {columns.map(({ content, label, options }) => (
        <td key={label}>
          <div
            style={{ justifyContent: options?.justify }}
            className={`${styles.cellContainer} ${
              options?.containerClassName ?? ''
            }`}
          >
            {content(item)}
          </div>
        </td>
      ))}
    </tr>
  )
}
