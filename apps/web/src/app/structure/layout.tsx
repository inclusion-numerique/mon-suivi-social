import { PropsWithChildren } from 'react'
import { getSessionUser } from '@mss/web/auth/getSessionUser'
import PrivateLayoutContent from '@mss/web/app/structure/PrivateLayoutContent'
import OnboardingWithoutOrganisation from '@mss/web/app/structure/OnboardingWithoutOrganisation'
import { redirect } from 'next/navigation'
import { Routes } from '@mss/web/app/routing/routes'
import PublicFooter from '@mss/web/app/(public)/PublicFooter'
import PublicLayout from '@mss/web/app/(public)/layout'
import { Breadcrumbs } from '@mss/web/ui/Breadcrumbs'
import PrivateHeader from '@mss/web/app/structure/PrivateHeader'

const LoggedInUserWithoutFullAccess = ({
  breadcrumbsCurrentPage = 'Création de compte',
  children,
}: PropsWithChildren<{ breadcrumbsCurrentPage?: string }>) => (
  <PublicLayout hideSigninButton>
    <div className="fr-container">
      <Breadcrumbs currentPage={breadcrumbsCurrentPage} />
      {children}
    </div>
  </PublicLayout>
)

const PrivateLayout = async ({ children }: PropsWithChildren) => {
  const user = await getSessionUser()

  if (!user) {
    redirect(Routes.Connexion.Login)
    return null
  }

  if (!user.organisationId) {
    return (
      <LoggedInUserWithoutFullAccess>
        <OnboardingWithoutOrganisation user={user} />
      </LoggedInUserWithoutFullAccess>
    )
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}
    >
      <PrivateHeader user={user} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PrivateLayoutContent user={user}>{children}</PrivateLayoutContent>
      </div>
      <PublicFooter />
    </div>
  )
}
export default PrivateLayout
