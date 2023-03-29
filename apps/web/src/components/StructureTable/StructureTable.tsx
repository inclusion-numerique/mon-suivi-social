import { Routes } from '@mss/web/app/routing/routes'
import { TableRowWithRowLink } from '@mss/web/components/Generic/table/TableRowWithRowLink'
import { structureColumns } from './structureColumns'
import { StructuresList } from '@mss/web/server/query/structure'

export const StructureTable = ({
  structures,
}: {
  structures: StructuresList
}) => {
  if (structures.length === 0) {
    return (
      <tr>
        <td colSpan={structureColumns.length}>
          Aucune structure ne correspond à votre recherche
        </td>
      </tr>
    )
  }

  return (
    <>
      {structures.map((structure) => {
        const href = Routes.Structure.Index.path(structure)

        const title = `Page de la structure ${structure.name}`

        return (
          <TableRowWithRowLink
            key={structure.id}
            item={structure}
            columns={structureColumns}
            href={href}
            title={title}
          />
        )
      })}
    </>
  )
}
