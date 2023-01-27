import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageConfig, PageTitle } from '@mss/web/app/structure/PageTitle'
import { Routes } from '@mss/web/app/routing/routes'
import { StructureForm } from '@mss/web/app/structure/structures/[id]/modifier/StructureForm'
import { serialize } from '@mss/web/utils/serialization'
import { EditStructureFeatureServer } from '@mss/web/features/editStructure/editStructure.server'
import { EditStructureFeatureClient } from '@mss/web/features/editStructure/editStructure.client'
import { notFound } from 'next/navigation'

export const revalidate = 0

const StructurePage = async ({}: { params?: { id: string } }) => {
  const user = await getAuthenticatedAgent()
  const organisationId = user.organisationId

  if (!EditStructureFeatureClient.securityCheck(user, { organisationId })) {
    notFound()
    return null
  }

  const existingState = await EditStructureFeatureServer.getExistingState({
    organisationId,
  })
  const { structure } = existingState

  const page: PageConfig = {
    ...Routes.Structure.Structures.Structure.Modifier,
    title: Routes.Structure.Structures.Structure.Modifier.title(structure),
  }

  return (
    <>
      <PageTitle
        page={page}
        parents={[
          Routes.Structure.Structures.Index,
          {
            title: Routes.Structure.Structures.Structure.Index.title(structure),
            path: Routes.Structure.Structures.Structure.Index.path({
              organisationId: structure.id,
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
export default StructurePage
