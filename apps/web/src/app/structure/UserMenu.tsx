import Link from 'next/link'
import { SessionUser } from '@mss/web/auth/sessionUser'
import { Routes } from '@mss/web/app/routing/routes'
import { getUserDisplayName } from '@mss/web/utils/user'

export const UserMenu = ({ user }: { user: SessionUser }) => {
  return (
    <Link
      href={Routes.Structure.MonCompte.Index}
      target="_self"
      className="fr-btn fr-btn--sm fr-btn--icon-left fr-icon-account-circle-fill"
    >
      {getUserDisplayName(user)}
    </Link>
  )
}
