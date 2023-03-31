import { ScrollToSupportItem } from './ScrollToSupportItem'
import { SupportList, GetBeneficiaryToViewReturn } from '@mss/web/server/query'
import styles from './BeneficiaryHistoryTab.module.scss'

import { SupportCard } from './SupportCard'
import { serialize } from '@mss/web/utils/serialization'
import { SessionUser } from '@mss/web/auth/sessionUser'

export function BeneficiaryHistoryTab({
  user,
  beneficiary,
  supports,
  scrollToItem,
}: {
  user: SessionUser
  beneficiary: GetBeneficiaryToViewReturn
  supports: SupportList
  scrollToItem?: string
}) {
  return (
    <>
      <ul className={`${styles.historyList} fr-raw-style`}>
        {supports.map((support) => (
          <SupportCard
            key={support.id}
            serializedBeneficiary={serialize(beneficiary)}
            serializedSupport={serialize(support)}
            serializedUser={serialize(user)}
          />
        ))}
      </ul>
      <ScrollToSupportItem item={scrollToItem} />
    </>
  )
}
