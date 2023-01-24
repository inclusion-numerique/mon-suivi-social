import { PageTitle } from '@mss/web/app/structure/PageTitle'
import { getAuthenticatedSessionUser } from '@mss/web/auth/getSessionUser'

const StructuresPage = async () => {
  const user = await getAuthenticatedSessionUser()
  return (
    <>
      <PageTitle
        organisationName={user.organisation?.name}
        icon="building-line"
        title="Structures"
      />
    </>
  )
}
export default StructuresPage
