import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { prismaClient } from '@mss/web/prismaClient'
import { PageTitle } from '@mss/web/app/structure/PageTitle'
export const revalidate = 0

const StructurePage = async ({}: { params?: { id: string } }) => {
  const user = await getAuthenticatedAgent()
  const structure = await prismaClient.organisation.findUniqueOrThrow({
    where: { id: user.organisationId },
  })

  return (
    <>
      <PageTitle icon="building-line" title={structure.name} />
    </>
  )
}
export default StructurePage
