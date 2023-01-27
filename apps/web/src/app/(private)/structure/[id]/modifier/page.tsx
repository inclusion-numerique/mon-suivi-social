import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageConfig, PageTitle } from '@mss/web/app/(private)/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { StructureForm } from '@mss/web/app/(private)/structure/[id]/modifier/StructureForm'
import { serialize } from '@mss/web/utils/serialization'
import { EditStructureFeatureServer } from '@mss/web/features/editStructure/editStructure.server'
import { EditStructureFeatureClient } from '@mss/web/features/editStructure/editStructure.client'
import { notFound } from 'next/navigation'

export const revalidate = 0

const StructureEditPage = async ({
  params: { id: organisationId },
}: {
  params: RoutePathParams<typeof Routes.Structure.Structure.Index.path>
}) => {
  const user = await getAuthenticatedAgent()

  if (!EditStructureFeatureClient.securityCheck(user, { organisationId })) {
    notFound()
    return null
  }

  const existingState = await EditStructureFeatureServer.getExistingState({
    organisationId,
  })
  const { structure } = existingState

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
              id: organisationId,
            }),
          },
        ]}
      />
      <div className="fr-card">
        <div className="fr-card__body fr-py-8v">
          <StructureForm existingState={serialize(existingState)} />
        </div>
      </div>
    </>
  )
}
export default StructureEditPage
