'use client'

import { beneficiaryDisplayName } from '@mss/web/beneficiary/beneficiary'
import { getUserDisplayName } from '@mss/web/utils/user'
import type { HistoryFollowup } from '@mss/web/app/structure/accompagnements/page'
import { useRouter } from 'next/navigation'
import { deserialize, Serialized } from '@mss/web/utils/serialization'
import { Routes } from '@mss/web/app/routing/routes'

export const FollowupRow = ({
  serializedFollowup,
}: {
  serializedFollowup: Serialized<HistoryFollowup>
}) => {
  const { beneficiary, id, medium, type, agent, status } =
    deserialize(serializedFollowup)
  const router = useRouter()

  const href = Routes.Structure.Beneficiaire.IndexWithParams(beneficiary, {
    tab: 'entretiens',
    item: id,
  })

  const statusBadge =
    status === 'Done' ? (
      <span className="fr-badge fr-badge--sm fr-badge--success fr-badge--icon-left fr-icon-check-line">
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
      <td>{medium}</td>
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
