import { SessionUser } from '@mss/web/auth/sessionUser'
import SideMenuLinks from '@mss/web/components/SideMenuLinks/SideMenuLinks'
import { FunctionComponent, ReactNode } from 'react'
import { serialize } from '@mss/web/utils/serialization'
import styles from './PrivateLayoutContent.module.css'

const PrivateLayoutContent: FunctionComponent<{
  user: SessionUser
  children: ReactNode
}> = ({ children, user }) => {
  const menuTitle = user.structure?.name ?? 'Administration'

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="fr-grid-row">
        <div className="fr-col-12 fr-col-md-4 fr-col-xl-3">
          <nav
            className="fr-sidemenu fr-sidemenu--sticky-full-height"
            role="navigation"
            aria-label="Menu de navigation"
          >
            <div className={`fr-sidemenu__inner ${styles['side-menu']}`}>
              <button
                className="fr-sidemenu__btn"
                hidden
                aria-controls="fr-sidemenu-wrapper"
                aria-expanded="false"
              >
                {menuTitle}
              </button>
              <div className="fr-collapse" id="fr-sidemenu-wrapper">
                <h4 className="fr-hidden fr-unhidden-md fr-mt-4v fr-mb-4v fr-ml-1w">
                  {menuTitle}
                </h4>

                <SideMenuLinks serializedUser={serialize(user)} />
              </div>
            </div>
          </nav>
        </div>
        <div className="fr-col-12 fr-col-md-8 fr-col-xl-9">
          <div className="fr-container fr-pt-2v">{children}</div>
        </div>
      </div>
    </main>
  )
}
export default PrivateLayoutContent
