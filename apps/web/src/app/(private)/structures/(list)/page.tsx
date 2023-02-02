import { PageTitle } from '@mss/web/app/(private)/PageTitle'
import { getAuthenticatedAgent } from '@mss/web/auth/getSessionUser'
import { Routes } from '@mss/web/app/routing/routes'
import { canListStructures } from '@mss/web/security/rules'
import { notFound } from 'next/navigation'

const StructuresPage = async () => {
  const user = await getAuthenticatedAgent()
  if (!canListStructures(user)) {
    notFound()
    return null
  }
  return (
    <>
      <PageTitle page={Routes.Structure.Structures.Index} />
    </>
  )
}
export default StructuresPage
