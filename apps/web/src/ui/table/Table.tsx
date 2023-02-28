import { ReactNode } from 'react'
import styles from '@mss/web/ui/table/Table.module.css'
import { PaginationNav, PaginationNavProps } from '@mss/web/ui/PaginationNav'

export function Table({
  tableHead,
  tableBody,
  tableFooter,
  pagination,
  className,
  opacity,
}: {
  pagination?: PaginationNavProps
  tableHead: ReactNode
  tableBody: ReactNode
  tableFooter?: ReactNode
  className?: string
  opacity?: number
}) {
  return <>
    <div
      className={`fr-table fr-table--bordered fr-mb-4v ${className ?? ''}`}
      style={{ opacity }}
    >
      <table className={styles.table}>
        <thead>{tableHead}</thead>
        <tbody>{tableBody}</tbody>
        {tableFooter ? <tfoot>{tableFooter}</tfoot> : null}
      </table>
    </div>
    {pagination ? <PaginationNav {...pagination} /> : null}
  </>
}
