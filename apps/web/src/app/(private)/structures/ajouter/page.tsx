import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageTitle } from '@mss/web/components/PageTitle'
import { Routes } from '@mss/web/app/routing/routes'
import { serialize } from '@mss/web/utils/serialization'
import { notFound } from 'next/navigation'
import { StructureFormCreation } from '@mss/web/components/StructureForm'
import { CreateStructureClient } from '@mss/web/features/structure/createStructure/createStructure.client'
import { getFollowupTypesForStructureCreation } from '@mss/web/features/structure/createStructure/createStructure.server'

export const revalidate = 0

const AddStructurePage = async () => {
  const user = await getAuthenticatedAgent()

  if (!CreateStructureClient.securityCheck(user, {}, {})) {
    notFound()
  }

  const availableFollowupTypes = await getFollowupTypesForStructureCreation()

  return (
    <>
      <PageTitle
        page={Routes.Structures.Ajouter}
        parents={[Routes.Structures.Index]}
      />
      <div className="fr-grid-row fr-grid-row--center fr-pb-8v">
        <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
          <div className="fr-card">
            <div className="fr-card__body fr-py-8v">
              <StructureFormCreation
                availableFollowupTypes={serialize(availableFollowupTypes)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default AddStructurePage
