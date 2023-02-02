import { nonBreakable } from '@mss/web/utils/nonBreakable'
import { TableColumnDefinition } from '@mss/web/ui/table/TableColumnDefinition'

export const TableHead = ({
  columns,
}: {
  columns: TableColumnDefinition<unknown>[]
}) => (
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
