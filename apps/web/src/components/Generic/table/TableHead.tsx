import { nonBreakable } from '@mss/web/utils/nonBreakable'
import { TableColumnDefinition } from '@mss/web/components/Generic/table/TableColumnDefinition'

export function TableHead<T>({
  columns,
}: {
  columns: TableColumnDefinition<T>[]
}) {
  return (
    <tr>
      {columns.map((column) => (
        <th key={column.label}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {nonBreakable(column.label)}
          </div>
        </th>
      ))}
    </tr>
  )
}
