import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { prismaClient } from '@mss/web/prismaClient'
export const revalidate = 0

const StructurePage = async ({}: { params?: { id: string } }) => {
  const user = await getAuthenticatedAgent()
  const structure = await prismaClient.organisation.findUniqueOrThrow({
    where: { id: user.organisationId },
  })

  return (
    <>
      <div className="fr-grid-row ">
        <h2>
          <span className="fr-icon-building-line fr-icon--lg fr-mr-1w" />
          {structure.name}
        </h2>
      </div>
    </>
  )
}
export default StructurePage
