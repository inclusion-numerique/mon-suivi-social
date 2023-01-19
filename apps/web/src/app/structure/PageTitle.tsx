import { PropsWithChildren } from 'react'

export const PageTitle = ({
  children,
  icon,
}: PropsWithChildren<{ icon: string }>) => (
  <div className="fr-grid-row ">
    <h2>
      <span className={`fr-icon-${icon} fr-icon--lg fr-mr-1w`} />
      {children}
    </h2>
  </div>
)
