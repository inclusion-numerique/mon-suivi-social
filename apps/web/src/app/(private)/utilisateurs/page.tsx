import { PageTitle } from '@mss/web/app/(private)/PageTitle'
import { getAuthenticatedSessionUser } from '@mss/web/auth/getSessionUser'
import { Routes } from '@mss/web/app/routing/routes'

const UtilisateursPage = async () => {
  const user = await getAuthenticatedSessionUser()

  return (
    <>
      <PageTitle page={Routes.Structure.Utilisateurs.Index} />
    </>
  )
}
export default UtilisateursPage
