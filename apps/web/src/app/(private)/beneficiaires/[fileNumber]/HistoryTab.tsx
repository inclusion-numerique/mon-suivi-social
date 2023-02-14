import { getUserDisplayName } from '@mss/web/utils/user'
import { SessionUser } from '@mss/web/auth/sessionUser'
import type { BeneficiaryPageSupport } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/page'
import { AttributeItem, AttributesList } from '@mss/web/ui/AttributesList'
import { formatBoolean } from '@mss/web/utils/formatBoolean'
import {
  followupStatusClasses,
  followupStatusLabels,
} from '@mss/web/features/followup/addFollowup.client'
import {
  helpRequestStatusBadgeClasses,
  helpRequestStatusLabels,
} from '@mss/web/features/helpRequest/addHelpRequest.client'
import { nonBreakable } from '@mss/web/utils/nonBreakable'

const FollowupTypeTag = ({ name }: { name: string }) => (
  <span className="fr-tag fr-tag--sm fr-mr-1w">{name}</span>
)

const displayAttributes = (support: BeneficiaryPageSupport): AttributeItem[] =>
  support.__type === 'helpRequest'
    ? [
        ['Type', "Demande d'aide"],
        ['Accompagnement', <FollowupTypeTag name={support.type.name} />],
        [
          'Statut',
          <span
            className={`fr-badge fr-badge--sm ${
              helpRequestStatusBadgeClasses[support.status]
            }`}
          >
            {helpRequestStatusLabels[support.status]}
          </span>,
        ],
        ['Demande financière', formatBoolean(support.financialSupport)],
      ]
    : [
        ['Type', 'Entretien'],
        [
          support.types.length === 1 ? 'Accompagnement' : 'Accompagnements',
          support.types.length === 0
            ? undefined
            : support.types.map((type) => <FollowupTypeTag name={type.name} />),
        ],
        [
          'Statut',
          <span
            className={`fr-badge fr-badge--sm ${
              followupStatusClasses[support.status]
            }`}
          >
            {followupStatusLabels[support.status]}
          </span>,
        ],
        ['Redirigé vers', support.structureName],
      ]

export const HistoryTab = ({
  user,
  supports,
}: {
  user: SessionUser
  supports: BeneficiaryPageSupport[]
}) => {
  return (
    <>
      <h4>Historique</h4>

      <div>
        {/* TODO use security rules instead of inlining security decisions with conditions*/}
        {supports.map((support) => {
          return (
            <div key={support.id} className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-2 fr-text-label--blue-france fr-text--bold">
                {support.historyDate.toLocaleDateString()}
              </div>
              <div className="fr-col-12 fr-col-md-10">
                <div className="fr-card">
                  <div className="fr-card__body fr-px-4w">
                    <div className="fr-card__content fr-py-4v">
                      <div className="fr-grid-row">
                        <div className="fr-col-12 fr-col-md-8">
                          <AttributesList items={displayAttributes(support)} />
                        </div>
                        <div
                          className={`fr-col-12 fr-col-md-4 fr-text--bold ${
                            support.createdById === user.id
                              ? 'fr-text-label--blue-france'
                              : null
                          }`}
                        >
                          {support.createdBy
                            ? getUserDisplayName(support.createdBy)
                            : 'Système'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
