import { Routes } from '@mss/web/app/routing/routes'
import { SessionUser } from '@mss/web/auth/sessionUser'
import {
  canEditBeneficiaryFollowup,
  canEditBeneficiaryHelpRequest,
} from '@mss/web/security/rules'
import {
  GetBeneficiaryToViewReturn,
  SupportListItem,
} from '@mss/web/server/query'
import { Link } from '../Generic/Link'
import styles from './SupportBody.module.scss'
import { SupportBodyDetail } from './SupportBodyDetail'

const SupportBody = ({
  support,
  beneficiary,
  user,
  accordionId,
  expanded,
}: {
  support: SupportListItem
  beneficiary: GetBeneficiaryToViewReturn
  user: SessionUser
  accordionId: string
  expanded: boolean
}) => {
  const boderStyle = support.isHelpRequest
    ? styles.borderHelpRequest
    : styles.borderInterview
  const padding = expanded ? styles.paddingExpanded : ''

  const canEdit = support.isHelpRequest
    ? canEditBeneficiaryHelpRequest(user, beneficiary, support)
    : canEditBeneficiaryFollowup(user, beneficiary, support)

  const editHref = support.isHelpRequest
    ? Routes.Accompagnements.DemandeDAide.Modifier.path({
        helpRequestId: support.id,
      })
    : Routes.Accompagnements.Entretien.Modifier.path({ followupId: support.id })

  return (
    <div
      id={accordionId}
      className={`fr-collapse ${boderStyle} ${padding} ${styles.beneficiaryHistoryDetailsBody}`}
    >
      <SupportBodyDetail support={support} />
      {/* <SupportBodyDocuments
        documents="history.documents"
      /> */}
      {support.synthesis && (
        <div>
          <h3 className={styles.synthesisTitle}>Compte rendu</h3>
          <p className={styles.synthesisContent}>{support.synthesis}</p>
        </div>
      )}
      {support.privateSynthesis && (
        <div>
          <h3 className={`fr-icon-lock-line ${styles.synthesisTitle}`}>
            Compte rendu privé
          </h3>
          <p className={styles.synthesisContent}>{support.privateSynthesis}</p>
        </div>
      )}
      {canEdit ? (
        <div className="fr-grid-row fr-mt-8v fr-mb-2v">
          <div className="fr-col-12">
            <Link
              href={editHref}
              className="fr-btn fr-btn--sm fr-btn--icon-left fr-icon-edit-line"
              title="Modifier cet accompagnement"
            >
              Modifier
            </Link>
          </div>
        </div>
      ) : null}
      <hr className="fr-pb-3v" />
    </div>
  )
}

export { SupportBody }
