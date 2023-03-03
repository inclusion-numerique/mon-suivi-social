import { PropsWithChildren } from 'react'

export function Card({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={`fr-card ${className ?? ''}`}>
    <div className="fr-card__body">
      <div className="fr-card__content">{children}</div>
    </div>
  </div>
}
