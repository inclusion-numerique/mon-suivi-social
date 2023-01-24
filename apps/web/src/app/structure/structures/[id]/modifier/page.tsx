import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { prismaClient } from '@mss/web/prismaClient'
import { PageConfig, PageTitle } from '@mss/web/app/structure/PageTitle'
import { Routes } from '@mss/web/app/routing/routes'

export const revalidate = 0

const StructurePage = async ({}: { params?: { id: string } }) => {
  const user = await getAuthenticatedAgent()
  const structure = await prismaClient.organisation.findUniqueOrThrow({
    where: { id: user.organisationId },
  })

  const page: PageConfig = {
    ...Routes.Structure.Structures.Modifier,
    title: Routes.Structure.Structures.Modifier.title(structure),
  }

  return (
    <>
      <PageTitle page={page} parents={[Routes.Structure.Structures.Index]} />
    </>
  )
}
export default StructurePage
