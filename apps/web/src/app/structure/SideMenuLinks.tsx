'use client'
import Link from 'next/link'
import { SessionUser } from '@mss/web/auth/sessionUser'
import { signOut } from 'next-auth/react'
import { useIsCurrentPathname } from '@mss/web/hooks/useIsCurrentPathname'
import { Routes } from '@mss/web/app/routing/routes'
import { deserialize, Serialized } from '@mss/web/utils/serialization'

type MenuLink = { title: string; path: string; icon: string }
const mainLinks: MenuLink[] = [
  Routes.Structure.Index,
  Routes.Structure.Beneficiaires.Index,
  Routes.Structure.Accompagnements.Index,
  Routes.Structure.Statistiques.Index,
  Routes.Structure.MonCompte.Index,
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

  const onLogoutClick = () => {
    signOut()
  }

  // TODO MSS depends on role
  const userSpecificLinks: MenuLink[] = []

  if (user.organisationId) {
    userSpecificLinks.push({
      title: 'Structure',
      path: Routes.Structure.Structures.Structure.Index.path({
        organisationId: user.organisationId,
      }),
      icon: 'building-line',
    })
  }

  // TODO MSS if admin or structure boss??
  userSpecificLinks.push(Routes.Structure.Utilisateurs.Index)

  const menuLinksWithCurrent = [...mainLinks, ...userSpecificLinks].map(
    (link) => ({
      ...link,
      current: isCurrent(link.path, link.path === Routes.Structure.Index.path),
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
