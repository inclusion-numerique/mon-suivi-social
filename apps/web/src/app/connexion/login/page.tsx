import { getSessionUser } from '@mss/web/auth/getSessionUser'
import { redirect } from 'next/navigation'
import { Signin } from '@mss/web/app/connexion/login/Signin'
import { Breadcrumbs } from '@mss/web/ui/Breadcrumbs'
import { Routes } from '@mss/web/app/routing/routes'

const SigninPage = async ({
  searchParams: { error } = {},
}: {
  searchParams?: { error?: string }
}) => {
  const user = await getSessionUser()
  if (user) {
    redirect(Routes.Index.path)
    return null
  }

  return (
    <>
      <Breadcrumbs currentPage="Connexion" />
      <Signin error={error} />
    </>
  )
}

export default SigninPage
