import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageConfig, PageTitle } from '@mss/web/app/(private)/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { StructureForm } from '@mss/web/app/(private)/structure/[id]/modifier/StructureForm'
import { serialize } from '@mss/web/utils/serialization'
import { notFound } from 'next/navigation'
import { EditStructureClient } from '@mss/web/features/structure/editStructure/editStructure.client'
import { EditStructureServer } from '@mss/web/features/structure/editStructure/editStructure.server'

export const revalidate = 0

const StructureEditPage = async ({
  params: { id: structureId },
}: {
  params: RoutePathParams<typeof Routes.Structure.Structure.Index.path>
}) => {
  const user = await getAuthenticatedAgent()

  if (!EditStructureClient.securityCheck(user, { structureId }, {})) {
    notFound()
    return null
  }

  const serverState = await EditStructureServer.getServerState({
    structureId,
  })
  const defaultInput = EditStructureServer.dataFromServerState(serverState)
  const { structure } = serverState

  const page: PageConfig = {
    ...Routes.Structure.Structure.Modifier,
    title: Routes.Structure.Structure.Modifier.title(structure),
  }

  return (
    <>
      <PageTitle
        page={page}
        parents={[
          {
            title: Routes.Structure.Structure.Index.title(structure),
            path: Routes.Structure.Structure.Index.path({
              id: structureId,
            }),
          },
        ]}
      />
      {/*TODO rendre moins large pour les forms*/}

      <div className="fr-grid-row fr-grid-row--center fr-pb-8v">
        <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
          <div className="fr-card">
            <div className="fr-card__body fr-py-8v">
              <StructureForm
                serverState={serialize(serverState)}
                defaultInput={serialize(defaultInput)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default StructureEditPage
