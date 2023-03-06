import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { PageTitle } from '@mss/web/components/PageTitle'
import { Routes } from '@mss/web/app/routing/routes'
import { notFound } from 'next/navigation'
import { CreateUserClient } from '@mss/web/features/user/createUser/createUser.client'
import { UserForm } from '@mss/web/components/UserForm/UserForm'

export const revalidate = 0

const AddUserPage = async () => {
  const user = await getAuthenticatedAgent()

  const { structureId } = user
  if (!CreateUserClient.securityCheck(user, { structureId }, {})) {
    notFound()
  }

  return (
    <>
      <PageTitle
        page={Routes.Utilisateurs.Ajouter}
        parents={[Routes.Utilisateurs.Index]}
      />
      <div className="fr-grid-row fr-grid-row--center fr-pb-8v">
        <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8">
          <div className="fr-card">
            <div className="fr-card__body fr-py-8v">
              <UserForm creation defaultInput={{ structureId }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default AddUserPage
