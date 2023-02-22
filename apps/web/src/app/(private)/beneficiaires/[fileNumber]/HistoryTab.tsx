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
import { dateAsDay } from '@mss/web/utils/dateAsDay'
import { ScrollToSupportItem } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/ScrollToSupportItem'
import {
  canEditBeneficiaryFollowup,
  canEditBeneficiaryHelpRequest,
  canViewBeneficiaryFollowupPrivateSynthesis,
  canViewBeneficiaryFollowupSynthesis,
  canViewBeneficiaryHelpRequestPrivateSynthesis,
  canViewBeneficiaryHelpRequestSynthesis,
} from '@mss/web/security/rules'
import { BeneficiaryPageInfo } from '@mss/web/app/(private)/beneficiaires/[fileNumber]/page'
import { Routes } from '@mss/web/app/routing/routes'
import Link from 'next/link'

export const HistoryTab = ({
  user,
  beneficiary,
  supports,
  scrollToItem,
}: {
  user: SessionUser
  beneficiary: BeneficiaryPageInfo
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
            beneficiary={beneficiary}
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
  beneficiary,
  support,
  user,
  scrollToItem,
}: {
  beneficiary: BeneficiaryPageInfo
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

  // This is a server component so private data in supports are not available to the browser unless passed to a client component
  // Be careful when passing data to client component
  const canSeeSynthesis = isHelpRequest
    ? canViewBeneficiaryHelpRequestSynthesis(user, beneficiary, support)
    : canViewBeneficiaryFollowupSynthesis(user, beneficiary, support)
  const canSeePrivateSynthesis = isHelpRequest
    ? canViewBeneficiaryHelpRequestPrivateSynthesis(user, beneficiary, support)
    : canViewBeneficiaryFollowupPrivateSynthesis(user, beneficiary, support)
  const synthesisAccordionId = `support-card-${support.id}`

  const canEdit = isHelpRequest
    ? canEditBeneficiaryHelpRequest(user, beneficiary, support)
    : canEditBeneficiaryFollowup(user, beneficiary, support)

  const editHref = isHelpRequest
    ? Routes.Accompagnements.DemandeDAide.Modifier.path({
        helpRequestId: support.id,
      })
    : Routes.Accompagnements.Entretien.Modifier.path({ followupId: support.id })

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
                    {dateAsDay(support.historyDate)}
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
                <div className="fr-col-12">
                  <AttributesList items={supportAttributes(support)} />
                  <p className="fr-mt-2v">🚧 en cours de développement</p>
                </div>
                {canSeeSynthesis ? (
                  <section
                    className="fr-accordion  fr-mt-4v"
                    style={{ width: '100%' }}
                  >
                    <h3 className="fr-accordion__title">
                      <button
                        className="fr-accordion__btn"
                        aria-expanded="false"
                        aria-controls={synthesisAccordionId}
                      >
                        Voir le compte rendu
                      </button>
                    </h3>
                    <div
                      className="fr-collapse fr-py-0"
                      id={synthesisAccordionId}
                    >
                      <p className="fr-background-alt--grey fr-mt-2v fr-py-2v fr-px-2w">
                        {support.synthesis ?? (
                          <i>Aucun compte rendu n&apos;a été renseigné</i>
                        )}
                      </p>
                      {canSeePrivateSynthesis ? (
                        <>
                          <p className="fr-text--bold">
                            <span className="fr-icon-lock-line fr-mr-1w" />
                            Compte rendu privé :
                          </p>
                          <p className="fr-background-alt--grey fr-mt-2v fr-py-2v fr-px-2w">
                            {support.privateSynthesis ?? (
                              <i>
                                Aucun compte rendu privé n&apos;a été renseigné
                              </i>
                            )}
                          </p>
                        </>
                      ) : null}
                    </div>
                  </section>
                ) : null}
                {canEdit ? (
                  <div className="fr-col-12 fr-pt-4v">
                    <Link
                      href={editHref}
                      className="fr-btn fr-btn--sm fr-btn--icon-left fr-icon-edit-line"
                      title="Modifier cet accompagnement"
                    >
                      Modifier
                    </Link>
                  </div>
                ) : null}
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
