import Link from 'next/link'
import { ReactNode } from 'react'
import styles from './Tabs.module.css'

export type TabOptions<T extends string = string> = {
  id: T
  title: string
  href?: string
  icon?: string
  content: ReactNode
}

const tabId = (id: string) => `tab-${id}`
const tabPanelId = (id: string) => `tab-${id}__panel`

export function Tabs<T extends string>({
  className,
  ariaLabel,
  current,
  tabs,
}: {
  className?: string
  ariaLabel: string
  current: T
  tabs: TabOptions<T>[]
}) {
  return (
    <div
      className={`fr-tabs fr-mt-4v ${styles.tabs} ${className ?? ''}`}
      style={{ backgroundColor: 'white' }}
    >
      <ul
        className="fr-tabs__list fr-py-0"
        role="tablist"
        aria-label={ariaLabel}
        style={{
          backgroundColor: '#fcfcfc',
        }}
      >
        {tabs.map(({ id, href, icon, title }) => {
          const tabClassName = icon
            ? `fr-tabs__tab fr-tabs__tab--icon-left fr-icon-${icon} `
            : 'fr-tabs__tab'

          const ariaSelected = id === current ? 'true' : 'false'

          return (
            <li role="presentation" key={id}>
              {href ? (
                <Link
                  id={tabId(id)}
                  className={tabClassName}
                  tabIndex={0}
                  role="tab"
                  aria-selected={ariaSelected}
                  aria-controls={tabPanelId(id)}
                  href={href}
                >
                  {title}
                </Link>
              ) : (
                <button
                  type="button"
                  id={tabId(id)}
                  className={tabClassName}
                  tabIndex={0}
                  role="tab"
                  aria-selected={ariaSelected}
                  aria-controls={tabPanelId(id)}
                >
                  {title}
                </button>
              )}
            </li>
          )
        })}
      </ul>
      {tabs.map(({ id, content }) => {
        const className =
          id === current
            ? 'fr-tabs__panel fr-tabs__panel--selected'
            : 'fr-tabs__panel'

        return (
          <div
            key={id}
            id={tabPanelId(id)}
            className={className}
            style={{
              // TODO Animation does not work on repeat click, this seems like a dsfr bug. Disabling transition while finding out why
              transition: 'none',
            }}
            role="tabpanel"
            aria-labelledby={tabId(id)}
            tabIndex={0}
          >
            {content}
          </div>
        )
      })}
    </div>
  )
}
