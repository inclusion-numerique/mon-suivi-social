import { PropsWithChildren } from 'react'
import { getSessionUser } from '@mss/web/auth/getSessionUser'
import { PrivateLayoutContent } from '@mss/web/components/PrivateLayoutContent'
import OnboardingWithoutStructure from '@mss/web/components/OnboardingWithoutStructure/OnboardingWithoutStructure'
import { redirect } from 'next/navigation'
import { Routes } from '@mss/web/app/routing/routes'
import { Breadcrumbs } from '@mss/web/ui/Breadcrumbs'
import PrivateHeader from '@mss/web/components/PrivateHeader/PrivateHeader'
import { PublicLayout } from '@mss/web/components/PublicLayout/PublicLayout'

function LoggedInUserWithoutFullAccess({
  breadcrumbsCurrentPage = 'Création de compte',
  children,
}: PropsWithChildren<{ breadcrumbsCurrentPage?: string }>) {
  return (
    <PublicLayout hideSigninButton>
      <div className="fr-container">
        <Breadcrumbs currentPage={breadcrumbsCurrentPage} />
        {children}
      </div>
    </PublicLayout>
  )
}

const PrivateLayout = async ({ children }: PropsWithChildren) => {
  const user = await getSessionUser()

  if (!user) {
    redirect(Routes.Connexion.Login)
    return null
  }

  if (!user.structureId) {
    return (
      <LoggedInUserWithoutFullAccess>
        <OnboardingWithoutStructure user={user} />
      </LoggedInUserWithoutFullAccess>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
      }}
    >
      <PrivateHeader user={user} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#fcfcfc',
        }}
      >
        <PrivateLayoutContent user={user}>{children}</PrivateLayoutContent>
      </div>
    </div>
  )
}
export default PrivateLayout
