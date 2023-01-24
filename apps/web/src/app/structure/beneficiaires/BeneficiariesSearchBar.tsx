'use client'

import { withTrpc } from '@mss/web/withTrpc'
import { trpc } from '@mss/web/trpc'
import { ChangeEventHandler, useDeferredValue, useState } from 'react'
import { Spinner } from '@mss/web/ui/Spinner'
import { beneficiaryDisplayName } from '@mss/web/beneficiary/beneficiary'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { Routes } from '@mss/web/app/routing/routes'

const SearchResult = styled.div`
  width: 100%;
  cursor: pointer;

  &:hover {
    font-weight: 600;
  }
`

const BeneficiariesSearchBar = () => {
  const router = useRouter()

  const [query, setQuery] = useState('')

  const deferredQuery = useDeferredValue(query)
  const queryEnabled = deferredQuery.trim().length >= 2

  const beneficiaries = trpc.beneficiary.search.useQuery(
    { query: deferredQuery },
    { enabled: queryEnabled },
  )

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuery(event.target.value)
  }

  const navigateToBeneficiary = (params: { fileNumber: string }) => {
    router.push(Routes.Structure.Beneficiaires.Beneficiaire.Index.path(params))
  }

  const prefetchBeneficiary = (params: { fileNumber: string }) => {
    router.prefetch(
      Routes.Structure.Beneficiaires.Beneficiaire.Index.path(params),
    )
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
        placeholder="Rechercher un bénéficiaire"
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
          {beneficiaries.isError ? <p>{beneficiaries.error.message}</p> : null}
          {beneficiaries.data ? (
            beneficiaries.data.beneficiaries.length === 0 ? (
              <p>Aucun résultat pour &quot;{deferredQuery}&quot;</p>
            ) : (
              <div style={{ width: '100%' }}>
                {beneficiaries.data.beneficiaries.map((beneficiary) => (
                  <SearchResult
                    onClick={() => navigateToBeneficiary(beneficiary)}
                    onMouseEnter={() => prefetchBeneficiary(beneficiary)}
                    key={beneficiary.id}
                    className="fr-py-4v"
                  >
                    <span className="fr-badge fr-badge--blue-cumulus">
                      {beneficiary.fileNumber}
                    </span>
                    <span className="fr-ml-1w">
                      {beneficiaryDisplayName(beneficiary)}
                    </span>
                  </SearchResult>
                ))}
              </div>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default withTrpc(BeneficiariesSearchBar)
