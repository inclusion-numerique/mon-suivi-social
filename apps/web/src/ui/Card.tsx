import { PropsWithChildren } from 'react'

export const Card = ({ children }: PropsWithChildren) => (
  <div className="fr-card">
    <div className="fr-card__body">
      <div className="fr-card__content">{children}</div>
    </div>
  </div>
)
