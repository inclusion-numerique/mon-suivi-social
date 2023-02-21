import styles from '@mss/web/app/(private)/beneficiaires/(liste)/TableRow.module.css'
import { TableColumnDefinition } from '@mss/web/ui/table/TableColumnDefinition'
import Link from 'next/link'

export function TableRowWithRowLink<Item extends Record<string, unknown>>({
  item,
  columns,
  href,
  title,
}: {
  item: Item
  columns: TableColumnDefinition<Item>[]
  href: string
  // Link title for accessibility
  title: string
}) {
  return (
    <tr className={styles.clickableRow}>
      {columns.map(({ content, label }, index) => (
        // Only allow tab navigation row to row so you can navigate with tab and enter
        // We use Links for accessibility, open in new tab, keyboard nav, ... that onClick does not provide
        // <a> tag inside tr or outside tr are not valid html so we are required to put <a> tags inside each cell
        // There are other tricks that work for a single <a> tag per row, but they are javascript or css hacks with have
        // tradeoffs on accessibility
        <td key={label} className={styles.cellWithLink}>
          <Link
            tabIndex={index > 0 ? -1 : undefined}
            className={`fr-raw-link fr-p-2v`}
            title={title}
            href={href}
          >
            {content(item)}
          </Link>
        </td>
      ))}
    </tr>
  )
}
