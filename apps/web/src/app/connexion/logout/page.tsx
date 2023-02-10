'use client'
import { signOut } from 'next-auth/react'
import { AuthCard } from '@mss/web/app/connexion/AuthCard'
import { useState } from 'react'
import { Breadcrumbs } from '@mss/web/ui/Breadcrumbs'
import Link from 'next/link'
import { Routes } from '@mss/web/app/routing/routes'
import { useRouter } from 'next/navigation'
import { getInclusionConnectLogoutUrl } from '@mss/web/auth/inclusionConnect'
import { getServerBaseUrl } from '@mss/web/utils/baseUrl'

const SignoutPage = () => {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const onSimpleLogout = async () => {
    setIsLoading(true)
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  // TODO MSS - This method does not work for now, how to tell that the user is still connected to other services ? It is a security issue for a shared computer
  const onTotalLogout = async () => {
    setIsLoading(true)
    await signOut({ redirect: false })
    router.push(
      `${getInclusionConnectLogoutUrl()}?post_logout_redirect_uri=${encodeURIComponent(
        getServerBaseUrl(),
      )}`,
    )
  }

  return (
    <>
      <Breadcrumbs currentPage="Déconnexion" />
      <AuthCard>
        <h2>Déconnexion</h2>
        <p>Êtes-vous sur de vouloir vous déconnecter&nbsp;?</p>
        <ul className="fr-btns-group">
          <li>
            <button
              type="button"
              className="fr-btn"
              disabled={isLoading}
              onClick={onSimpleLogout}
            >
              Se déconnecter
            </button>
          </li>
          {/*<li>*/}
          {/*  <button*/}
          {/*    type="button"*/}
          {/*    className="fr-btn"*/}
          {/*    disabled={isLoading}*/}
          {/*    onClick={onTotalLogout}*/}
          {/*  >*/}
          {/*    Se déconnecter de {PublicConfig.productTitle} et de mon compte*/}
          {/*    Inclusion Connect*/}
          {/*  </button>*/}
          {/*</li>*/}
        </ul>
        <div className="fr-grid-row fr-grid-row--center">
          <Link href={Routes.Index.path}>Retour</Link>
        </div>
      </AuthCard>
    </>
  )
}

export default SignoutPage
