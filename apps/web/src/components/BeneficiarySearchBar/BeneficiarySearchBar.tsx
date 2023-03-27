'use client'

import { withTrpc } from '@mss/web/components/TrpcProvider'
import { trpc } from '@mss/web/trpc'
import { ChangeEventHandler, useDeferredValue, useState } from 'react'
import { Spinner } from '@mss/web/components/Generic/Spinner'
import { beneficiaryDisplayName } from '@mss/web/utils/beneficiary'
import { useRouter } from 'next/navigation'
import { Routes } from '@mss/web/app/routing/routes'
import styles from './BeneficiarySearchBar.module.css'
import { Link } from '@mss/web/components/Generic/Link'

export const BeneficiarySearchBar = withTrpc(
  ({ structureId }: { structureId: string }) => {
    const router = useRouter()

    const [query, setQuery] = useState('')

    const deferredQuery = useDeferredValue(query)
    const queryEnabled = deferredQuery.trim().length >= 2

    const beneficiaries = trpc.beneficiary.search.useQuery(
      { query: deferredQuery, structureId },
      { enabled: queryEnabled },
    )

    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      setQuery(event.target.value)
    }

    const navigateToBeneficiary = (parameters: { fileNumber: string }) => {
      router.push(Routes.Beneficiaires.Beneficiaire.Index.path(parameters))
    }

    const prefetchBeneficiary = (parameters: { fileNumber: string }) => {
      router.prefetch(Routes.Beneficiaires.Beneficiaire.Index.path(parameters))
    }

    return (
      <div
        className="fr-search-bar"
        style={{ flex: 1, position: 'relative' }}
        id="header-search"
        role="search"
      >
        <label className="fr-label" htmlFor="search">
          Recherche
        </label>
        <input
          className="fr-input"
          placeholder="Rechercher un·e bénéficiaire"
          type="search"
          id="search"
          autoFocus
          onChange={onChange}
        />
        <button className="fr-btn" title="Rechercher">
          Rechercher
        </button>
        {queryEnabled ? (
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 0,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '0 0 4px 4px',
            }}
            className="fr-background-default--grey fr-card--shadow fr-px-4v fr-py-2v"
          >
            {beneficiaries.isLoading ? (
              <div className="fr-mx-auto">
                <Spinner />
              </div>
            ) : null}
            {beneficiaries.isError ? (
              <p>{beneficiaries.error.message}</p>
            ) : null}
            {beneficiaries.data ? (
              beneficiaries.data.beneficiaries.length === 0 ? (
                <p>Aucun résultat pour &quot;{deferredQuery}&quot;</p>
              ) : (
                <div style={{ width: '100%' }}>
                  {beneficiaries.data.beneficiaries.map((beneficiary) => (
                    <Link
                      className={`fr-py-4v ${styles['beneficiary-search-result']}`}
                      href={Routes.Beneficiaires.Beneficiaire.Index.path(
                        beneficiary,
                      )}
                      key={beneficiary.id}
                    >
                      <span className="fr-badge fr-badge--blue-cumulus">
                        {beneficiary.fileNumber}
                      </span>
                      <span className="fr-ml-1w">
                        {beneficiaryDisplayName(beneficiary)}
                      </span>
                    </Link>
                  ))}
                </div>
              )
            ) : null}
          </div>
        ) : null}
      </div>
    )
  },
)
