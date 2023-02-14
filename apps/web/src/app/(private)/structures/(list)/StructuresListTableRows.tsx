import { asyncComponent } from '@mss/web/utils/asyncComponent'
import { Routes } from '@mss/web/app/routing/routes'
import { TableRowWithRowLink } from '@mss/web/ui/table/TableRowWithRowLink'
import type { QueryResult } from '@mss/web/features/createQuery.server'
import { ListStructuresServer } from '@mss/web/features/structure/listStructures/listStructures.server'
import { structuresListTableColumns } from '@mss/web/app/(private)/structures/(list)/structuresListTableColumns'

export const StructuresListTableRows = asyncComponent(
  async ({
    structures,
  }: Pick<QueryResult<typeof ListStructuresServer>, 'structures'>) => {
    if (structures.length === 0) {
      return (
        <tr>
          <td colSpan={structuresListTableColumns.length}>
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
              columns={structuresListTableColumns}
              href={href}
              title={title}
            />
          )
        })}
      </>
    )
  },
)
