'use client'
import Link from 'next/link'
import { SessionUser } from '@mss/web/auth/sessionUser'
import { signOut } from 'next-auth/react'
import { useIsCurrentPathname } from '@mss/web/hooks/useIsCurrentPathname'
import { Routes } from '@mss/web/app/routing/routes'

const mainLinks = [
  {
    title: 'Tableau de bord',
    path: Routes.Structure.Index,
    icon: 'profil-line',
  },
  {
    title: 'Bénéficiaires',
    path: Routes.Structure.Beneficiaires.Index,
    icon: 'user-line',
  },
  {
    title: 'Accompagnements',
    path: Routes.Structure.Accompagnements.Index,
    icon: 'folder-2-line',
  },
  {
    title: 'Statistiques',
    path: Routes.Structure.Statistiques.Index,
    icon: 'pie-chart-2-line',
  },
  {
    title: 'Mon compte',
    path: Routes.Structure.MonCompte.Index,
    icon: 'user-setting-line',
  },
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

const SideMenuLinks = ({ user }: { user: SessionUser }) => {
  const isCurrent = useIsCurrentPathname()

  const onLogoutClick = () => {
    signOut()
  }

  // TODO MSS depends on role
  const userSpecificLinks: typeof mainLinks = []

  if (user.organisationId) {
    userSpecificLinks.push({
      title: 'Structure',
      path: Routes.Structure.Structures.Modifier({
        organisationId: user.organisationId,
      }),
      icon: 'building-line',
    })
  }

  // TODO MSS if admin or structure boss??
  userSpecificLinks.push({
    title: 'Utilisateurs',
    path: Routes.Structure.Utilisateurs.Index,
    icon: 'team-line',
  })

  const menuLinksWithCurrent = [...mainLinks, ...userSpecificLinks].map(
    (link) => ({
      ...link,
      current: isCurrent(link.path),
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
