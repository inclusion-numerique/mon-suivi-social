'use client'

import { SessionUser } from '@mss/web/auth/sessionUser'

import {
  GetBeneficiaryToViewReturn,
  SupportListItem,
} from '@mss/web/server/query'
import { useState } from 'react'
import { SupportHeader } from './SupportHeader'
import styles from './SupportCard.module.css'
import { Serialized, deserialize } from '@mss/web/utils/serialization'
import { SupportBody } from './SupportBody'

export function SupportCard({
  serializedSupport,
  serializedBeneficiary,
  serializedUser,
}: {
  serializedBeneficiary: Serialized<GetBeneficiaryToViewReturn>
  serializedSupport: Serialized<SupportListItem>
  serializedUser: Serialized<SessionUser>
}) {
  const support = deserialize(serializedSupport)
  const beneficiary = deserialize(serializedBeneficiary)
  const user = deserialize(serializedUser)
  const [expanded, setExpanded] = useState(false)

  const historyId = support.id
  const accordionId = `accordion-${historyId}`

  //   const hasUnreadNotifications = unreadNotifications.includes(historyId);

  const toggleAccordion = () => {
    setExpanded(!expanded)
  }

  return (
    <li
      id={`history-${support.id}`}
      className={`${
        styles.beneficiaryHistoryDetailsAccordion
      } force-focus-visible ${expanded ? styles.expanded : ''}`}
    >
      <SupportHeader
        support={support}
        accordionId={accordionId}
        toggleAccordion={toggleAccordion}
        expanded={expanded}
      />
      <SupportBody
        support={support}
        beneficiary={beneficiary}
        user={user}
        accordionId={accordionId}
        expanded={expanded}
      />
    </li>
  )
}
