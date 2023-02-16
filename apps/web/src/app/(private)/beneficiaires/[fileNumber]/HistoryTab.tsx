import { getUserDisplayName } from '@mss/web/utils/user'
import { SessionUser } from '@mss/web/auth/sessionUser'
import type { BeneficiaryPageSupport } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/page'
import { AttributeItem, AttributesList } from '@mss/web/ui/AttributesList'
import { formatBoolean } from '@mss/web/utils/formatBoolean'
import {
  followupMediumLabels,
  followupStatusClasses,
  followupStatusLabels,
} from '@mss/web/features/followup/addFollowup.client'
import {
  helpRequestStatusBadgeClasses,
  helpRequestStatusLabels,
} from '@mss/web/features/helpRequest/addHelpRequest.client'
import { nonBreakable } from '@mss/web/utils/nonBreakable'
import { stringToBoolean } from '@mss/web/utils/booleanString'
import { formatDate } from '@mss/web/utils/formatDate'
import { ScrollToSupportItem } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/ScrollToSupportItem'

export const HistoryTab = ({
  user,
  supports,
  scrollToItem,
}: {
  user: SessionUser
  supports: BeneficiaryPageSupport[]
  scrollToItem?: string
}) => {
  return (
    <>
      <div>
        {/* TODO use security rules instead of inlining security decisions with conditions*/}
        {supports.map((support) => (
          <SupportCard
            key={support.id}
            support={support}
            user={user}
            scrollToItem={scrollToItem}
          />
        ))}
      </div>
      <ScrollToSupportItem item={scrollToItem} />
    </>
  )
}

const SupportCard = ({
  support,
  user,
  scrollToItem,
}: {
  support: BeneficiaryPageSupport
  user: SessionUser
  scrollToItem?: string
}) => {
  const isHelpRequest = support.__type === 'helpRequest'
  const types = isHelpRequest ? [support.type] : support.types

  const creator = support.createdBy
    ? getUserDisplayName(support.createdBy)
    : 'Système'

  const title = `${
    isHelpRequest ? "Demande d'aide ajoutée" : 'Entretien ajouté'
  } par ${creator}`

  const statusLabel = isHelpRequest
    ? helpRequestStatusLabels[support.status]
    : followupStatusLabels[support.status]
  const statusBadgeClass = isHelpRequest
    ? helpRequestStatusBadgeClasses[support.status]
    : followupStatusClasses[support.status]

  const highlightedStyle =
    scrollToItem === support.id
      ? { backgroundColor: 'var(--blue-france-975-75)' }
      : undefined

  return (
    <div
      key={support.id}
      id={support.id}
      className="fr-grid-row fr-grid-row--center"
    >
      <div className="fr-col-12 fr-col-lg-10 fr-col-xl-8 fr-mt-4v">
        <div className="fr-card" style={highlightedStyle}>
          <div className="fr-card__body fr-px-4w">
            <div className="fr-card__content fr-py-4v">
              <div className="fr-grid-row">
                <div
                  className="fr-col-12"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <p className="fr-text--bold fr-mb-2v">
                    {formatDate(support.historyDate)}
                  </p>
                  <p
                    className={`fr-text--bold  fr-mb-2v ${
                      support.createdById === user.id
                        ? 'fr-text-label--blue-france'
                        : null
                    }`}
                  >
                    {title}
                  </p>
                </div>
                <div className="fr-col-12">
                  <span className={`fr-badge fr-badge--sm ${statusBadgeClass}`}>
                    {statusLabel}
                  </span>
                </div>
                <div className="fr-col-12 fr-mt-1v">
                  {types.map((type) => (
                    <FollowupTypeTag
                      key={type.id}
                      name={nonBreakable(type.name)}
                    />
                  ))}
                </div>
                <div className="fr-col-12 fr-col-md-8">
                  <AttributesList items={supportAttributes(support)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const FollowupTypeTag = ({ name }: { name: string }) => (
  <span className="fr-tag fr-tag--sm fr-mt-1v fr-mr-1v">{name}</span>
)

const supportAttributes = (support: BeneficiaryPageSupport): AttributeItem[] =>
  support.__type === 'helpRequest'
    ? [
        [
          'Demande financière',
          support.financialSupport === null
            ? null
            : formatBoolean(support.financialSupport),
        ],
        ['Organisme prescripteur', support.prescribingOrganisation],
      ]
    : [
        ['Type', support.medium ? followupMediumLabels[support.medium] : null],
        ['Redirigé vers', support.structureName],
      ]
