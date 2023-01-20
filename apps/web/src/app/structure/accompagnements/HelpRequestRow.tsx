'use client'

import { beneficiaryDisplayName } from '@mss/web/beneficiary/beneficiary'
import { getUserDisplayName } from '@mss/web/utils/user'
import type { HistoryHelpRequest } from '@mss/web/app/structure/accompagnements/page'
import { useRouter } from 'next/navigation'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { Routes } from '@mss/web/app/routing/routes'

export const HelpRequestRow = ({
  serializedHelpRequest,
}: {
  serializedHelpRequest: Serialized<HistoryHelpRequest>
}) => {
  const router = useRouter()

  const helpRequest = deserialize(serializedHelpRequest)
  const { status, id, beneficiary, agent, type } = helpRequest
  const href = Routes.Structure.Beneficiaire.IndexWithParams(beneficiary, {
    tab: 'historique',
    accompagnement: id,
  })

  const statusBadge =
    status === 'Accepted' ? (
      <span className="fr-badge fr-badge--sm fr-badge--success fr-badge--icon-left fr-icon-check-line">
        {status}
      </span>
    ) : status === 'Denied' ? (
      <span className="fr-badge fr-badge--sm fr-badge--error fr-badge--icon-left fr-icon-error-line">
        {status}
      </span>
    ) : (
      <span className="fr-badge fr-badge--sm fr-badge--icon-left fr-icon-time-line">
        {status}
      </span>
    )

  return (
    <tr
      key={id}
      onMouseEnter={() => router.prefetch(href)}
      onClick={() => router.push(href)}
    >
      <td>{statusBadge}</td>
      <td>{type.name}</td>
      <td>
        <span className="fr-badge fr-badge--blue-cumulus fr-mr-1w">
          {beneficiary.fileNumber}
        </span>
      </td>
      <td>{beneficiaryDisplayName(beneficiary)}</td>
      <td>{getUserDisplayName(agent)}</td>
    </tr>
  )
}
