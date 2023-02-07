import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageConfig, PageTitle } from '@mss/web/app/(private)/PageTitle'
import { RoutePathParams, Routes } from '@mss/web/app/routing/routes'
import { serialize } from '@mss/web/utils/serialization'
import { notFound } from 'next/navigation'
import { EditStructureClient } from '@mss/web/features/structure/editStructure/editStructure.client'
import { EditStructureServer } from '@mss/web/features/structure/editStructure/editStructure.server'
import { StructureForm } from '@mss/web/app/(private)/structure/StructureForm'
import StructureEditPage from '@mss/web/app/(private)/structure/[id]/modifier/page'
import { CreateStructureClient } from '@mss/web/features/structure/createStructure/createStructure.client'
import { getFollowupTypesForStructureCreation } from '@mss/web/features/structure/createStructure/createStructure.server'

export const revalidate = 0

const AddStructurePage = async () => {
  const user = await getAuthenticatedAgent()

  if (!CreateStructureClient.securityCheck(user, {}, {})) {
    notFound()
    return null
  }

  const availableFollowupTypes = await getFollowupTypesForStructureCreation()

  return (
    <>
      <PageTitle
        page={Routes.Structure.Structures.Ajouter}
        parents={[Routes.Structure.Structures.Index]}
      />
      <div className="fr-grid-row fr-grid-row--center fr-pb-8v">
        <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
          <div className="fr-card">
            <div className="fr-card__body fr-py-8v">
              <StructureForm
                creation
                availableFollowupTypes={serialize(availableFollowupTypes)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default StructureEditPage
