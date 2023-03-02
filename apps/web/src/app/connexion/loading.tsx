import { Spinner } from '@mss/web/ui/Spinner'
import { AuthCard } from '@mss/web/components/SigninPanel/AuthCard'
import { Breadcrumbs } from '@mss/web/ui/Breadcrumbs'

function AuthLoading() {
  return (
    <>
      <Breadcrumbs currentPage="Connexion" />
      <AuthCard>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            minHeight: 320,
            flex: 1,
          }}
        >
          <Spinner />
        </div>
      </AuthCard>
    </>
  )
}

export default AuthLoading
