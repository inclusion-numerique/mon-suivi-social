'use client'
import Link from 'next/link'
import { SessionUser } from '@mss/web/auth/sessionUser'
import { signOut } from 'next-auth/react'
import { useIsCurrentPathname } from '@mss/web/hooks/useIsCurrentPathname'
import { Routes } from '@mss/web/app/routing/routes'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { canListStructures } from '@mss/web/security/rules'

type MenuLink = { title: string; path: string; icon: string }
const mainLinks: MenuLink[] = [
  Routes.Index,
  Routes.Beneficiaires.Index,
  Routes.Accompagnements.Index,
  Routes.Statistiques.Index,
  Routes.MonCompte.Index,
]

const MenuLinkItem = ({
  current,
  icon,
  path,
  title,
}: {
  path: string
  current: boolean
  icon: string
  title: string
}) => {
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

const SideMenuLinks = ({
  serializedUser,
}: {
  serializedUser: Serialized<SessionUser>
}) => {
  const user = deserialize(serializedUser)
  const isCurrent = useIsCurrentPathname()

  // TODO MSS depends on role
  const userSpecificLinks: MenuLink[] = []

  if (canListStructures(user)) {
    userSpecificLinks.push({
      title: 'Structures',
      path: Routes.Structures.Index.path,
      icon: 'building-line',
    })
  } else if (user.structureId) {
    userSpecificLinks.push({
      title: 'Structure',
      path: Routes.Structure.Index.path({
        id: user.structureId,
      }),
      icon: 'building-line',
    })
  }

  // TODO MSS if admin or structure boss??
  userSpecificLinks.push(Routes.Utilisateurs.Index)

  const menuLinksWithCurrent = [...mainLinks, ...userSpecificLinks].map(
    (link) => ({
      ...link,
      current: isCurrent(link.path, link.path === Routes.Index.path),
    }),
  )

  return (
    <ul className="fr-sidemenu__list">
      {menuLinksWithCurrent.map((item) => (
        <MenuLinkItem key={item.path} {...item} />
      ))}
    </ul>
  )
}
export default SideMenuLinks
