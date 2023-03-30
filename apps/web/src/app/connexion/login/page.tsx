import { getSessionUser } from '@mss/web/auth/getSessionUser'
import { redirect } from 'next/navigation'
import { SigninPanel } from '@mss/web/components/SigninPanel'
import { Breadcrumbs } from '@mss/web/components/Generic'
import { Routes } from '@mss/web/app/routing/routes'

const SigninPage = async ({
  searchParams: { error } = {},
}: {
  searchParams?: { error?: string }
}) => {
  const user = await getSessionUser()
  if (user) {
    redirect(Routes.TableauDeBord.path)
    return null
  }

  return (
    <>
      <Breadcrumbs currentPage="Connexion" />
      <SigninPanel error={error} />
    </>
  )
}

export default SigninPage
