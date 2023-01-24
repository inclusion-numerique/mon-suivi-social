import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { prismaClient } from '@mss/web/prismaClient'
import { PageTitle } from '@mss/web/app/structure/PageTitle'
import { Routes } from '@mss/web/app/routing/routes'
export const revalidate = 0

const StructurePage = async ({}: { params?: { id: string } }) => {
  const user = await getAuthenticatedAgent()
  const structure = await prismaClient.organisation.findUniqueOrThrow({
    where: { id: user.organisationId },
  })

  return (
    <>
      <PageTitle
        icon="building-line"
        title={structure.name}
        parents={[
          { title: 'Structures', href: Routes.Structure.Structures.Index },
        ]}
      />
    </>
  )
}
export default StructurePage
