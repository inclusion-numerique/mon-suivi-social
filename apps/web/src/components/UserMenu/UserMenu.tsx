import { Link } from '@mss/web/components/Generic/Link'
import { SessionUser } from '@mss/web/auth/sessionUser'
import { Routes } from '@mss/web/app/routing/routes'
import { getUserDisplayName } from '@mss/web/utils/user'

export function UserMenu({ user }: { user: SessionUser }) {
  return (
    <Link
      href={Routes.MonCompte.Index.path}
      target="_self"
      className="fr-btn fr-btn--sm fr-btn--icon-left fr-icon-user-setting-line"
    >
      {getUserDisplayName(user)}
    </Link>
  )
}
