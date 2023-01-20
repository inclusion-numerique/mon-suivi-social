import { PropsWithChildren } from 'react'

export const AuthCard = ({ children }: PropsWithChildren) => (
  <main role="main" id="content">
    <div className="fr-container fr-container--fluid fr-mb-md-12v fr-mt-12v">
      <div className="fr-grid-row fr-grid-row--center">
        <div className="fr-col-12 fr-col-md-8 fr-col-lg-6 fr-col-xl-6 fr-background-alt--grey fr-px-4v fr-py-4v fr-p-md-14v">
          {children}
        </div>
      </div>
    </div>
  </main>
)
