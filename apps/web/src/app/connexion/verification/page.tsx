import { getSessionUser } from '@mss/web/auth/getSessionUser'
import { redirect } from 'next/navigation'
import { Verify } from '@mss/web/components/Verify'
import { Breadcrumbs } from '@mss/web/components/Generic'
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
