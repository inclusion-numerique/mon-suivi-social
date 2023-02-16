import { PropsWithChildren } from 'react'

export const Card = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <div className={`fr-card ${className ?? ''}`}>
    <div className="fr-card__body">
      <div className="fr-card__content">{children}</div>
    </div>
  </div>
)
