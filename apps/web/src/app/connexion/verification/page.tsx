import { getSessionUser } from '@mss/web/auth/getSessionUser'
import { redirect } from 'next/navigation'
import { Verify } from '@mss/web/app/connexion/verification/Verify'
import { Breadcrumbs } from '@mss/web/ui/Breadcrumbs'
import { Routes } from '@mss/web/app/routing/routes'

const VerifyPage = async () => {
  const user = await getSessionUser()
  if (user) {
    redirect(Routes.Index.path)
    return null
  }

  return (
    <>
      <Breadcrumbs currentPage="Connexion" />
      <Verify />
    </>
  )
}

export default VerifyPage
