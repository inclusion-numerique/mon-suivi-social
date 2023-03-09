'use client'

import Link from 'next/link'
import { SessionUser } from '@mss/web/auth/sessionUser'
import { useIsCurrentPathname } from '@mss/web/hooks/useIsCurrentPathname'
import { Routes } from '@mss/web/app/routing/routes'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import {
  canAccessStatsPage,
  canListStructures,
  canListUsers,
} from '@mss/web/security/rules'

type MenuLink = { title: string; path: string; icon: string }

function MenuLinkItem({
  item: { current, icon, path, title },
}: {
  item: {
    path: string
    current: boolean
    icon: string
    title: string
  }
}) {
  return (
    <li
      className={`fr-sidemenu__item ${
        current ? 'fr-sidemenu__item--active' : ''
      }`}
    >
      <Link
        className="fr-sidemenu__link"
        aria-current={current ? true : undefined}
        href={path}
      >
        <span className={`fr-icon-${icon}`} />
        <span className="fr-ml-1w">{title}</span>
      </Link>
    </li>
  )
}

function SideMenuLinks({
  serializedUser,
}: {
  serializedUser: Serialized<SessionUser>
}) {
  const user = deserialize(serializedUser)
  const isCurrent = useIsCurrentPathname()

  // TODO MSS depends on role
  const menuLinks: MenuLink[] = [
    Routes.Index,
    Routes.Beneficiaires.Index,
    Routes.Accompagnements.Index,
  ]

  if (canAccessStatsPage(user)) menuLinks.push(Routes.Statistiques.Index)

  menuLinks.push(Routes.MonCompte.Index)

  if (canListStructures(user)) menuLinks.push(Routes.Structures.Index)
  else if (user.structureId) {
    menuLinks.push({
      ...Routes.Structure.Index,
      title: 'Structure',
      path: Routes.Structure.Index.path({
        id: user.structureId,
      }),
    })
  }

  if (canListUsers(user, { structureId: user.structureId }))
    menuLinks.push(Routes.Utilisateurs.Index)

  const menuLinksWithCurrent = menuLinks.map((link) => ({
    ...link,
    current: isCurrent(link.path, link.path === Routes.Index.path),
  }))

  return (
    <ul className="fr-sidemenu__list">
      {menuLinksWithCurrent.map((item) => (
        <MenuLinkItem key={item.path} item={item} />
      ))}
    </ul>
  )
}
export default SideMenuLinks
