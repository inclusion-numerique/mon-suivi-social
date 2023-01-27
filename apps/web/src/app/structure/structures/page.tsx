import { PageTitle } from '@mss/web/app/structure/PageTitle'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { Routes } from '@mss/web/app/routing/routes'

const StructuresPage = async () => {
  const user = await getAuthenticatedAgent()
  const organisationId = user.organisationId

  return (
    <>
      <PageTitle page={Routes.Structure.Structures.Index} />
    </>
  )
}
export default StructuresPage
