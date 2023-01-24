import { PageTitle } from '@mss/web/app/structure/PageTitle'
import { getAuthenticatedSessionUser } from '@mss/web/auth/getSessionUser'

const UtilisateursPage = async () => {
  const user = await getAuthenticatedSessionUser()

  return (
    <>
      <PageTitle
        icon="team-line"
        title="Utilisateurs"
        organisationName={user.organisation?.name}
      />
    </>
  )
}
export default UtilisateursPage
